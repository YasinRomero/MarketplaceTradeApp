import { mockProducts } from "@/mocks/products";
import { ProductDraftInputSchema, ProductDraftSchema, ProductFiltersSchema, ProductSchema } from "@/schemas/domain";
import { Product, ProductDraft, ProductDraftInput, ProductFilters } from "@/types/domain";

let products: (Product | ProductDraft)[] = mockProducts.map((product) => ({ ...product, media: [...product.media] }));

const wait = () => new Promise<void>((resolve) => setTimeout(resolve, 120));

export async function listProducts(filters: ProductFilters = {}): Promise<Product[]> {
	await wait();
	const parsedFilters = ProductFiltersSchema.parse(filters);
	return products
		.filter((product): product is Product => product.status === "activo")
		.filter(
			(product) =>
				!parsedFilters.search || product.title.toLowerCase().includes(parsedFilters.search.toLowerCase()),
		)
		.filter((product) => !parsedFilters.siteId || product.siteId === parsedFilters.siteId)
		.filter((product) => !parsedFilters.categoryId || product.categoryId === parsedFilters.categoryId)
		.filter((product) => !parsedFilters.mode || product.mode === parsedFilters.mode || product.mode === "ambas")
		.map((product) => ProductSchema.parse(product));
}

export async function getProductById(id: number): Promise<Product | null> {
	await wait();
	const product = products.find((candidate): candidate is Product => candidate.id === id && candidate.status === "activo");
	return product ? ProductSchema.parse(product) : null;
}

export async function listProductsByOwner(ownerId: number): Promise<(Product | ProductDraft)[]> {
	await wait();
	return products
		.filter((product) => product.ownerId === ownerId)
		.map((product) => (product.status === "borrador" ? ProductDraftSchema.parse(product) : ProductSchema.parse(product)));
}

export async function saveProductDraft(input: ProductDraftInput): Promise<ProductDraft> {
	await wait();
	const draft = ProductDraftInputSchema.parse(input);
	const now = new Date().toISOString();
	const product: ProductDraft = {
		id: Math.max(0, ...products.map((item) => item.id)) + 1,
		ownerId: draft.ownerId,
		siteId: draft.siteId,
		...(draft.categoryId === undefined ? {} : { categoryId: draft.categoryId }),
		title: draft.title ?? "",
		description: draft.description ?? "",
		mode: draft.mode ?? "venta",
		salePrice: draft.salePrice ?? null,
		referenceValue: draft.referenceValue ?? null,
		attributes: draft.attributes ?? {},
		status: "borrador",
		media: draft.media ?? [],
		createdAt: now,
		updatedAt: null,
	};
	products = [...products, product];
	return product;
}

export async function publishProduct(input: ProductDraftInput): Promise<Product> {
	await wait();
	const draft = ProductDraftInputSchema.parse(input);
	const now = new Date().toISOString();
	const id = Math.max(0, ...products.map((item) => item.id)) + 1;
	const product: Product = {
		id,
		ownerId: draft.ownerId,
		siteId: draft.siteId,
		categoryId: draft.categoryId ?? 0,
		title: draft.title ?? "",
		description: draft.description ?? "",
		mode: draft.mode ?? "venta",
		salePrice: draft.salePrice ?? null,
		referenceValue: draft.referenceValue ?? null,
		attributes: draft.attributes ?? {},
		status: "activo",
		media: (draft.media ?? []).map((media) => ({ ...media, productId: id })),
		createdAt: now,
		updatedAt: null,
	};
	const validatedProduct = ProductSchema.parse(product);
	products = [...products, validatedProduct];
	return validatedProduct;
}

export async function deactivateProduct(id: number, ownerId: number): Promise<Product> {
	await wait();
	const index = products.findIndex((product) => product.id === id && product.ownerId === ownerId);
	if (index < 0) throw new Error("La publicación no existe o no pertenece al usuario.");
	const current = products[index];
	if (current.status !== "activo") throw new Error("Solo se puede desactivar una publicación activa.");
	const updated: Product = { ...current, status: "inactivo", updatedAt: new Date().toISOString() };
	products = [...products.slice(0, index), updated, ...products.slice(index + 1)];
	return updated;
}
