import { Product, ProductMedia } from "@/schemas/product";
import { User } from "@/types/identity";

const capturedAt = "2026-09-20T15:00:00.000Z";
const localVideoUrl = require("../../assets/videos/probarvideo.mp4") as string;

export const mockUsers: User[] = [
	{
		id: 1,
		siteId: 1,
		microsoftId: "mock-user-1",
		email: "ana@utp.edu.pe",
		fullName: "Ana Torres",
		role: "usuario",
		isActive: true,
	},
	{
		id: 2,
		siteId: 1,
		microsoftId: "mock-moderator-1",
		email: "moderacion@utp.edu.pe",
		fullName: "Equipo de moderación",
		role: "moderador",
		isActive: true,
	},
	{
		id: 3,
		siteId: 1,
		microsoftId: "mock-user-3",
		email: "lucia@utp.edu.pe",
		fullName: "Lucía Salazar",
		role: "usuario",
		isActive: true,
	},
];

const media = (id: number, productId: number, type: ProductMedia["type"], url: string): ProductMedia => ({
	id,
	productId,
	type,
	url,
	capturedAt,
});

export const mockProducts: Product[] = [
	{
		id: 101,
		ownerId: 1,
		siteId: 1,
		categoryId: 10,
		title: "Laptop para clases",
		description: "Laptop usada en buen estado, ideal para trabajos académicos.",
		mode: "ambas",
		salePrice: 1800,
		referenceValue: 1800,
		attributes: { Memoria: "8 GB", Almacenamiento: "256 GB SSD" },
		status: "activo",
		media: [
			media(1001, 101, "imagen", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853"),
			media(1002, 101, "video", localVideoUrl),
		],
		createdAt: capturedAt,
		updatedAt: null,
	},
	{
		id: 102,
		ownerId: 1,
		siteId: 1,
		categoryId: 11,
		title: "Libro de cálculo",
		description: "Texto de cálculo diferencial con anotaciones de estudio.",
		mode: "venta",
		salePrice: 45,
		referenceValue: null,
		attributes: { Edición: "Tercera" },
		status: "activo",
		media: [
			media(1003, 102, "imagen", "https://images.unsplash.com/photo-1543002588-bfa74002ed7e"),
			media(1004, 102, "video", "mock://captured-video-102"),
		],
		createdAt: capturedAt,
		updatedAt: null,
	},
	{
		id: 103,
		ownerId: 3,
		siteId: 1,
		categoryId: 12,
		title: "Bicicleta urbana",
		description: "Bicicleta urbana en buen estado para movilización dentro del campus.",
		mode: "ambas",
		salePrice: 700,
		referenceValue: 650,
		attributes: { Tipo: "Urbana", Estado: "Usada" },
		status: "activo",
		media: [
			media(1005, 103, "imagen", "https://images.unsplash.com/photo-1485965120184-e220f721d03e"),
			media(1006, 103, "video", localVideoUrl),
		],
		createdAt: capturedAt,
		updatedAt: null,
	},
	{
		id: 104,
		ownerId: 3,
		siteId: 1,
		categoryId: 12,
		title: "Guitarra acústica",
		description: "Guitarra acústica disponible para intercambio dentro del campus.",
		mode: "intercambio",
		salePrice: null,
		referenceValue: 500,
		attributes: { Tipo: "Acústica", Estado: "Usada" },
		status: "activo",
		media: [
			media(1007, 104, "imagen", "https://images.unsplash.com/photo-1525201548942-d8732f6617a0"),
			media(1008, 104, "video", localVideoUrl),
		],
		createdAt: capturedAt,
		updatedAt: null,
	},
];
