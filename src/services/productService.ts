import { mockProducts, mockUsers } from "@/mocks/products";
import {
	Product,
	ProductDraft,
	ProductDraftInput,
	ProductDraftInputSchema,
	ProductDraftSchema,
	ProductFilters,
	ProductFiltersSchema,
	ProductSchema,
} from "@/schemas/product";

let products: (Product | ProductDraft)[] = mockProducts.map((product) => ({ ...product, media: [...product.media] }));
export const PRODUCT_FINALIZATION_TOKEN = Symbol("product-finalization");

const wait = () => new Promise<void>((resolve) => setTimeout(resolve, 120));

function assertActiveInstitutionalUser(userId: number): void {
	const user = mockUsers.find((candidate) => candidate.id === userId);
	if (!user || !user.isActive || user.role !== "usuario") {
		throw new Error("Solo un usuario institucional activo puede administrar publicaciones.");
	}
}

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
	const product = products.find(
		(candidate): candidate is Product => candidate.id === id && candidate.status === "activo",
	);
	return product ? ProductSchema.parse(product) : null;
}

export async function getProductByIdForOperations(id: number): Promise<Product | null> {
	await wait();
	const product = products.find(
		(candidate): candidate is Product => candidate.id === id && candidate.status !== "borrador",
	);
	return product ? ProductSchema.parse(product) : null;
}

export async function listProductsForOperations(): Promise<Product[]> {
	await wait();
	return products
		.filter((product): product is Product => product.status !== "borrador")
		.map((product) => ProductSchema.parse(product));
}

async function reserveAvailableProducts(productIds: number[]): Promise<Product[]> {
	await wait();

	if (productIds.length === 0 || new Set(productIds).size !== productIds.length)
		throw new Error("Una operación requiere productos diferentes.");

	const selected = productIds.map((productId) =>
		products.find(
			(candidate): candidate is Product => candidate.id === productId && candidate.status !== "borrador",
		),
	);

	const available = selected.filter((product): product is Product => Boolean(product && product.status === "activo"));
	if (available.length !== productIds.length) throw new Error("Uno de los productos ya no está disponible.");

	const now = new Date().toISOString();
	const reserved: Product[] = available.map((product) => ({ ...product, status: "reservado", updatedAt: now }));
	products = products.map((product) => reserved.find((candidate) => candidate.id === product.id) ?? product);
	return reserved;
}

export async function reserveProducts(productIds: [number, number]): Promise<[Product, Product]> {
	const reserved = await reserveAvailableProducts(productIds);
	return [reserved[0], reserved[1]];
}

export async function reserveProduct(productId: number): Promise<Product> {
	const reserved = await reserveAvailableProducts([productId]);
	return reserved[0];
}

export async function releaseProducts(productIds: number[]): Promise<Product[]> {
	await wait();
	if (productIds.length === 0 || new Set(productIds).size !== productIds.length)
		throw new Error("La operación debe incluir productos diferentes.");

	const selected = productIds.map((productId) =>
		products.find(
			(candidate): candidate is Product => candidate.id === productId && candidate.status !== "borrador",
		),
	);

	const reserved = selected.filter((product): product is Product =>
		Boolean(product && product.status === "reservado"),
	);
	if (reserved.length !== productIds.length)
		throw new Error("Solo se pueden liberar productos reservados por la operación.");

	const now = new Date().toISOString();
	const released = reserved.map((product) => ({ ...product, status: "activo" as const, updatedAt: now }));
	products = products.map((product) => released.find((candidate) => candidate.id === product.id) ?? product);
	return released;
}

export async function finalizeProducts(
	productIds: number[],
	authorizationToken?: typeof PRODUCT_FINALIZATION_TOKEN,
): Promise<Product[]> {
	await wait();
	if (authorizationToken !== PRODUCT_FINALIZATION_TOKEN)
		throw new Error("La finalización solo puede autorizarla el cierre económico confirmado.");

	if (productIds.length === 0 || new Set(productIds).size !== productIds.length)
		throw new Error("El cierre debe incluir productos diferentes.");

	const selected = productIds.map((productId) =>
		products.find(
			(candidate): candidate is Product => candidate.id === productId && candidate.status !== "borrador",
		),
	);
	if (selected.some((product): product is undefined => !product))
		throw new Error("Uno de los productos de la operación no existe.");

	const currentProducts = selected as Product[];
	if (currentProducts.every((product) => product.status === "finalizado"))
		return currentProducts.map((product) => ProductSchema.parse(product));

	if (currentProducts.some((product) => product.status !== "reservado"))
		throw new Error("Solo se pueden finalizar productos reservados por una operación completada.");

	const now = new Date().toISOString();
	const finalized = currentProducts.map((product) => ({ ...product, status: "finalizado" as const, updatedAt: now }));
	products = products.map((product) => finalized.find((candidate) => candidate.id === product.id) ?? product);
	return finalized.map((product) => ProductSchema.parse(product));
}

export async function listProductsByOwner(ownerId: number): Promise<(Product | ProductDraft)[]> {
	await wait();
	assertActiveInstitutionalUser(ownerId);

	return products
		.filter((product) => product.ownerId === ownerId)
		.map((product) =>
			product.status === "borrador" ? ProductDraftSchema.parse(product) : ProductSchema.parse(product),
		);
}

export async function saveProductDraft(input: ProductDraftInput): Promise<ProductDraft> {
	await wait();
	const draft = ProductDraftInputSchema.parse(input);
	assertActiveInstitutionalUser(draft.ownerId);

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
	assertActiveInstitutionalUser(draft.ownerId);

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

export async function updateProduct(
	id: number,
	ownerId: number,
	input: ProductDraftInput,
): Promise<Product | ProductDraft> {
	await wait();
	assertActiveInstitutionalUser(ownerId);

	const draft = ProductDraftInputSchema.parse(input);
	const index = products.findIndex((product) => product.id === id && product.ownerId === ownerId);
	if (index < 0) throw new Error("La publicación no existe o no pertenece al usuario.");

	const current = products[index];
	if (current.status !== "activo" && current.status !== "borrador" && current.status !== "inactivo")
		throw new Error("Solo se pueden editar publicaciones disponibles, borradores o inactivas.");

	const updatedBase = {
		...current,
		...(draft.siteId === undefined ? {} : { siteId: draft.siteId }),
		...(draft.categoryId === undefined ? {} : { categoryId: draft.categoryId }),
		...(draft.title === undefined ? {} : { title: draft.title }),
		...(draft.description === undefined ? {} : { description: draft.description }),
		...(draft.mode === undefined ? {} : { mode: draft.mode }),
		...(draft.salePrice === undefined ? {} : { salePrice: draft.salePrice }),
		...(draft.referenceValue === undefined ? {} : { referenceValue: draft.referenceValue }),
		...(draft.attributes === undefined ? {} : { attributes: draft.attributes }),
		...(draft.media === undefined ? {} : { media: draft.media.map((media) => ({ ...media, productId: id })) }),
		updatedAt: new Date().toISOString(),
	};

	const updated =
		current.status === "borrador"
			? ProductDraftSchema.parse({ ...updatedBase, status: "borrador" })
			: ProductSchema.parse({ ...updatedBase, status: current.status });
	products = [...products.slice(0, index), updated, ...products.slice(index + 1)];
	return updated;
}

export async function activateProduct(id: number, ownerId: number, input?: ProductDraftInput): Promise<Product> {
	await wait();
	assertActiveInstitutionalUser(ownerId);

	const index = products.findIndex((product) => product.id === id && product.ownerId === ownerId);
	if (index < 0) throw new Error("La publicación no existe o no pertenece al usuario.");

	const current = products[index];
	if (current.status !== "borrador" && current.status !== "inactivo")
		throw new Error("Solo se puede activar un borrador o una publicación inactiva.");

	const draft = ProductDraftInputSchema.parse(
		input ?? {
			ownerId: current.ownerId,
			siteId: current.siteId,
			categoryId: current.categoryId,
			title: current.title,
			description: current.description,
			mode: current.mode,
			salePrice: current.salePrice,
			referenceValue: current.referenceValue,
			attributes: current.attributes,
			media: current.media,
		},
	);

	const product = ProductSchema.parse({
		...current,
		...(draft.siteId === undefined ? {} : { siteId: draft.siteId }),
		...(draft.categoryId === undefined ? {} : { categoryId: draft.categoryId }),
		...(draft.title === undefined ? {} : { title: draft.title }),
		...(draft.description === undefined ? {} : { description: draft.description }),
		...(draft.mode === undefined ? {} : { mode: draft.mode }),
		...(draft.salePrice === undefined ? {} : { salePrice: draft.salePrice }),
		...(draft.referenceValue === undefined ? {} : { referenceValue: draft.referenceValue }),
		...(draft.attributes === undefined ? {} : { attributes: draft.attributes }),
		...(draft.media === undefined ? {} : { media: draft.media.map((media) => ({ ...media, productId: id })) }),
		status: "activo",
		updatedAt: new Date().toISOString(),
	});

	products = [...products.slice(0, index), product, ...products.slice(index + 1)];
	return product;
}

export async function deactivateProduct(id: number, ownerId: number): Promise<Product> {
	await wait();
	assertActiveInstitutionalUser(ownerId);

	const index = products.findIndex((product) => product.id === id && product.ownerId === ownerId);
	if (index < 0) throw new Error("La publicación no existe o no pertenece al usuario.");

	const current = products[index];
	if (current.status !== "activo") throw new Error("Solo se puede desactivar una publicación activa.");

	const updated: Product = { ...current, status: "inactivo", updatedAt: new Date().toISOString() };
	products = [...products.slice(0, index), updated, ...products.slice(index + 1)];
	return updated;
}
