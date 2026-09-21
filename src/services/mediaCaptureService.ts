import { MediaType } from "@/types/domain";

interface CaptureResult {
	type: MediaType;
	url: string;
}

const getBrowserMedia = () => {
	if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
		throw new Error("La cámara no está disponible en este entorno.");
	}
	return navigator.mediaDevices;
};

export async function captureProductMedia(type: MediaType): Promise<CaptureResult> {
	const mediaDevices = getBrowserMedia();
	const stream = await mediaDevices.getUserMedia({ video: true, audio: type === "video" });

	try {
		if (type === "imagen") {
			const ImageCaptureConstructor = (globalThis as typeof globalThis & {
				ImageCapture?: new (track: MediaStreamTrack) => { takePhoto: () => Promise<Blob> };
			}).ImageCapture;
			if (!ImageCaptureConstructor) throw new Error("La captura de fotografías no está disponible en este navegador.");
			const photo = await new ImageCaptureConstructor(stream.getVideoTracks()[0]).takePhoto();
			return { type, url: URL.createObjectURL(photo) };
		}

		if (typeof MediaRecorder === "undefined") throw new Error("La grabación de video no está disponible en este navegador.");
		const chunks: Blob[] = [];
		const recorder = new MediaRecorder(stream);
		const recording = new Promise<Blob>((resolve, reject) => {
			recorder.ondataavailable = (event) => event.data.size > 0 && chunks.push(event.data);
			recorder.onerror = () => reject(new Error("No se pudo capturar el video."));
			recorder.onstop = () => resolve(new Blob(chunks, { type: recorder.mimeType || "video/webm" }));
		});
		recorder.start();
		setTimeout(() => recorder.stop(), 1000);
		return { type, url: URL.createObjectURL(await recording) };
	} finally {
		stream.getTracks().forEach((track) => track.stop());
	}
}
