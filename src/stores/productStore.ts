import { Product, ProductDraft, ProductDraftInput, ProductFilters } from "@/schemas/product";
import {
	activateProduct,
	deactivateProduct,
	listProducts,
	listProductsByOwner,
	publishProduct,
	saveProductDraft,
	updateProduct,
} from "@/services/productService";
import { create } from "zustand";

interface ProductStore {
	products: Product[];
	ownedProducts: (Product | ProductDraft)[];
	isLoading: boolean;
	error: string | null;
	loadProducts: (filters?: ProductFilters) => Promise<void>;
	loadOwnedProducts: (ownerId: number) => Promise<void>;
	saveDraft: (input: ProductDraftInput) => Promise<ProductDraft | null>;
	publish: (input: ProductDraftInput) => Promise<Product | null>;
	update: (id: number, ownerId: number, input: ProductDraftInput) => Promise<(Product | ProductDraft) | null>;
	activate: (id: number, ownerId: number, input?: ProductDraftInput) => Promise<Product | null>;
	deactivate: (id: number, ownerId: number) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
	products: [],
	ownedProducts: [],
	isLoading: false,
	error: null,

	loadProducts: async (filters = {}) => {
		set({ isLoading: true, error: null });

		try {
			set({ products: await listProducts(filters), isLoading: false });
		} catch (error) {
			console.error(
				"[productStore] loadProducts failed",
				error instanceof Error ? error.message : "Unknown error",
			);
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudieron cargar las publicaciones.",
			});
		}
	},

	loadOwnedProducts: async (ownerId) => {
		set({ isLoading: true, error: null });

		try {
			set({ ownedProducts: await listProductsByOwner(ownerId), isLoading: false });
		} catch (error) {
			console.error(
				"[productStore] loadOwnedProducts failed",
				error instanceof Error ? error.message : "Unknown error",
			);
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudieron cargar tus publicaciones.",
			});
		}
	},

	saveDraft: async (input) => {
		set({ isLoading: true, error: null });

		try {
			const product = await saveProductDraft(input);
			set((state) => ({ ownedProducts: [...state.ownedProducts, product], isLoading: false }));
			return product;
		} catch (error) {
			console.error("[productStore] saveDraft failed", error instanceof Error ? error.message : "Unknown error");
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudo guardar el borrador.",
			});
			return null;
		}
	},

	publish: async (input) => {
		set({ isLoading: true, error: null });

		try {
			const product = await publishProduct(input);
			set((state) => ({
				ownedProducts: [...state.ownedProducts, product],
				products: [...state.products, product],
				isLoading: false,
			}));
			return product;
		} catch (error) {
			console.error("[productStore] publish failed", error instanceof Error ? error.message : "Unknown error");
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudo activar la publicación.",
			});
			return null;
		}
	},

	update: async (id, ownerId, input) => {
		set({ isLoading: true, error: null });

		try {
			const product = await updateProduct(id, ownerId, input);
			set((state) => ({
				ownedProducts: state.ownedProducts.map((item) => (item.id === product.id ? product : item)),
				products:
					product.status === "activo"
						? state.products.some((item) => item.id === product.id)
							? state.products.map((item) => (item.id === product.id ? product : item))
							: [...state.products, product]
						: state.products.filter((item) => item.id !== product.id),
				isLoading: false,
			}));
			return product;
		} catch (error) {
			console.error("[productStore] update failed", error instanceof Error ? error.message : "Unknown error");
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudieron guardar los cambios.",
			});
			return null;
		}
	},

	activate: async (id, ownerId, input) => {
		set({ isLoading: true, error: null });

		try {
			const product = await activateProduct(id, ownerId, input);
			set((state) => ({
				ownedProducts: state.ownedProducts.map((item) => (item.id === product.id ? product : item)),
				products: state.products.some((item) => item.id === product.id)
					? state.products.map((item) => (item.id === product.id ? product : item))
					: [...state.products, product],
				isLoading: false,
			}));
			return product;
		} catch (error) {
			console.error("[productStore] activate failed", error instanceof Error ? error.message : "Unknown error");
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudo activar la publicación.",
			});
			return null;
		}
	},

	deactivate: async (id, ownerId) => {
		set({ isLoading: true, error: null });

		try {
			const product = await deactivateProduct(id, ownerId);
			set((state) => ({
				ownedProducts: state.ownedProducts.map((item) => (item.id === product.id ? product : item)),
				products: state.products.filter((item) => item.id !== product.id),
				isLoading: false,
			}));
		} catch (error) {
			console.error("[productStore] deactivate failed", error instanceof Error ? error.message : "Unknown error");
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : "No se pudo desactivar la publicación.",
			});
		}
	},
}));
