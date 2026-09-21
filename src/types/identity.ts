export type UserRole = "usuario" | "moderador";

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
