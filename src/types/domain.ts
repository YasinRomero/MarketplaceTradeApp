export type UserRole = "usuario" | "moderador";
export type PublicationMode = "venta" | "intercambio" | "ambas";
export type ProductStatus = "borrador" | "activo" | "reservado" | "finalizado" | "inactivo";
export type MediaType = "imagen" | "video";

export interface CampusSite {
	id: number;
	name: string;
	address?: string;
	isActive: boolean;
}

export interface Category {
	id: number;
	name: string;
	parentId: number | null;
	isActive: boolean;
}

export interface User {
	id: number;
	siteId: number;
	microsoftId: string;
	email: string;
	fullName: string;
	role: UserRole;
	isActive: boolean;
}

export interface ProductMedia {
	id: number;
	productId: number;
	type: MediaType;
	url: string;
	capturedAt: string;
}

export interface Product {
	id: number;
	ownerId: number;
	siteId: number;
	categoryId: number;
	title: string;
	description: string;
	mode: PublicationMode;
	salePrice: number | null;
	referenceValue: number | null;
	attributes: Record<string, string>;
	status: ProductStatus;
	media: ProductMedia[];
	createdAt: string;
	updatedAt: string | null;
}

export interface ProductDraft {
	id: number;
	ownerId: number;
	siteId: number;
	categoryId?: number;
	title: string;
	description: string;
	mode: PublicationMode;
	salePrice: number | null;
	referenceValue: number | null;
	attributes: Record<string, string>;
	status: "borrador";
	media: ProductMedia[];
	createdAt: string;
	updatedAt: string | null;
}

export interface ProductDraftInput {
	ownerId: number;
	siteId: number;
	categoryId?: number;
	title?: string;
	description?: string;
	mode?: PublicationMode;
	salePrice?: number | null;
	referenceValue?: number | null;
	attributes?: Record<string, string>;
	media?: ProductMedia[];
}

export interface ProductFilters {
	search?: string;
	siteId?: number;
	categoryId?: number;
	mode?: PublicationMode;
}
