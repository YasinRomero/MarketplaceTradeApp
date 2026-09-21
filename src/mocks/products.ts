import { Product, ProductMedia, User } from "@/types/domain";

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
];
