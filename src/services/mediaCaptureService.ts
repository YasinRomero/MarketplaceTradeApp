import { MediaType } from "@/schemas/product";

export interface CaptureResult {
	type: MediaType;
	url: string;
}

export interface VideoRecordingController {
	stop: () => Promise<CaptureResult>;
	cancel: () => void;
}

const getObjectUrl = (blob: Blob, type: MediaType) => {
	if (blob.size === 0 || !blob.type)
		throw new Error(`La ${type === "imagen" ? "fotografía" : "grabación"} capturada está vacía.`);

	return URL.createObjectURL(blob);
};

const getCaptureError = (error: unknown) => {
	const errorName = error instanceof Error ? error.name : "";
	if (errorName === "NotAllowedError" || errorName === "SecurityError")
		return "Permiso de cámara denegado. Habilítalo en el navegador para capturar evidencias.";

	if (errorName === "NotFoundError") return "No se encontró una cámara disponible en este dispositivo.";
	return "No se pudo acceder a la cámara. Revisa los permisos del navegador.";
};

export async function startCamera(): Promise<MediaStream> {
	if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia)
		throw new Error("La cámara no está disponible en este entorno.");

	try {
		return await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
	} catch (error) {
		throw new Error(getCaptureError(error));
	}
}

export function stopCamera(stream: MediaStream | null): void {
	stream?.getTracks().forEach((track) => track.stop());
}

const capturePhotoFromStream = async (stream: MediaStream): Promise<Blob> => {
	const videoTrack = stream.getVideoTracks()[0];
	if (!videoTrack) throw new Error("No se encontró una pista de video activa.");

	const ImageCaptureConstructor = (
		globalThis as typeof globalThis & {
			ImageCapture?: new (track: MediaStreamTrack) => { takePhoto: () => Promise<Blob> };
		}
	).ImageCapture;

	if (ImageCaptureConstructor) {
		try {
			const photo = await new ImageCaptureConstructor(videoTrack).takePhoto();
			if (photo.size > 0) return photo;
		} catch {}
	}

	if (typeof document === "undefined")
		throw new Error("La captura de fotografías no está disponible en este entorno.");

	const video = document.createElement("video");
	video.muted = true;
	video.playsInline = true;
	video.srcObject = stream;

	try {
		await video.play();
		if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
			await new Promise<void>((resolve, reject) => {
				video.onloadeddata = () => resolve();
				video.onerror = () => reject(new Error("No se pudo preparar la vista de la cámara."));
			});
		}

		const canvas = document.createElement("canvas");
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		if (canvas.width === 0 || canvas.height === 0) throw new Error("La cámara no entregó una imagen válida.");

		const context = canvas.getContext("2d");
		if (!context) throw new Error("No se pudo preparar la fotografía capturada.");
		context.drawImage(video, 0, 0, canvas.width, canvas.height);

		const photo = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
		if (!photo) throw new Error("No se pudo generar la fotografía capturada.");

		return photo;
	} finally {
		video.pause();
		video.srcObject = null;
	}
};

export async function capturePhoto(stream: MediaStream): Promise<CaptureResult> {
	const photo = await capturePhotoFromStream(stream);
	return { type: "imagen", url: getObjectUrl(photo, "imagen") };
}

const getSupportedVideoMimeType = () => {
	if (typeof MediaRecorder === "undefined") return null;
	const candidates = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm", "video/mp4"];
	return candidates.find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) ?? null;
};

export function startVideoRecording(stream: MediaStream, onError?: (error: Error) => void): VideoRecordingController {
	if (typeof MediaRecorder === "undefined")
		throw new Error("La grabación de video no está disponible en este navegador.");

	const mimeType = getSupportedVideoMimeType();
	if (!mimeType) throw new Error("El navegador no admite un formato de video compatible.");

	const recorder = new MediaRecorder(stream, { mimeType });
	const chunks: Blob[] = [];
	let stopped = false;
	let cancelled = false;
	let stopPromise: Promise<CaptureResult> | null = null;

	const recording = new Promise<CaptureResult>((resolve, reject) => {
		recorder.ondataavailable = (event) => {
			if (event.data.size > 0) chunks.push(event.data);
		};

		recorder.onerror = () => {
			const error = new Error("No se pudo capturar el video.");
			onError?.(error);
			reject(error);
		};

		recorder.onstop = () => {
			if (cancelled) {
				reject(new Error("La grabación fue cancelada."));
				return;
			}

			const video = new Blob(chunks, { type: recorder.mimeType || mimeType });

			if (video.size === 0) {
				const error = new Error("La grabación de video está vacía.");
				onError?.(error);
				reject(error);
				return;
			}

			try {
				resolve({ type: "video", url: getObjectUrl(video, "video") });
			} catch (error) {
				onError?.(error instanceof Error ? error : new Error("No se pudo preparar el video capturado."));
				reject(error);
			}
		};

		try {
			recorder.start(100);
		} catch {
			const error = new Error("No se pudo iniciar la grabación de video.");
			onError?.(error);
			reject(error);
		}
	});

	recording.catch(() => undefined);

	return {
		stop: () => {
			if (!stopPromise) {
				stopPromise = recording;
				if (!stopped && recorder.state === "recording") {
					stopped = true;
					recorder.stop();
				}
			}
			return stopPromise;
		},

		cancel: () => {
			cancelled = true;
			if (recorder.state === "recording") recorder.stop();
		},
	};
}
