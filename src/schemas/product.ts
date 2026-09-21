import { z } from "zod";

export const PublicationModeSchema = z.enum(["venta", "intercambio", "ambas"]);
export const ProductStatusSchema = z.enum(["borrador", "activo", "reservado", "finalizado", "inactivo"]);
export const MediaTypeSchema = z.enum(["imagen", "video"]);

export const ProductMediaSchema = z.object({
	id: z.number().int().positive(),
	productId: z.number().int().positive(),
	type: MediaTypeSchema,
	url: z.string().min(1),
	capturedAt: z.iso.datetime(),
	isPublication: z.boolean().optional(),
	isEvidence: z.boolean().optional(),
});

export const ProductSchema = z
	.object({
		id: z.number().int().positive(),
		ownerId: z.number().int().positive(),
		siteId: z.number().int().positive(),
		categoryId: z.number().int().positive(),
		title: z.string().trim().min(1).max(160),
		description: z.string().trim().min(1),
		mode: PublicationModeSchema,
		salePrice: z.number().nonnegative().nullable(),
		referenceValue: z.number().nonnegative().nullable(),
		attributes: z.record(z.string(), z.string()),
		status: ProductStatusSchema,
		media: z.array(ProductMediaSchema),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime().nullable(),
	})
	.superRefine((product, context) => {
		if (product.status !== "activo") return;

		if ((product.mode === "venta" || product.mode === "ambas") && product.salePrice === null)
			context.addIssue({ code: "custom", path: ["salePrice"], message: "El precio de venta es obligatorio." });

		if ((product.mode === "intercambio" || product.mode === "ambas") && product.referenceValue === null) {
			context.addIssue({
				code: "custom",
				path: ["referenceValue"],
				message: "El valor referencial es obligatorio.",
			});
		}

		const publicationMedia = product.media.filter((media) => media.isPublication !== false);
		const evidenceMedia = product.media.filter((media) => media.isEvidence !== false);

		if (!publicationMedia.some((media) => media.type === "imagen"))
			context.addIssue({ code: "custom", path: ["media"], message: "Se requiere una fotografía capturada." });

		if (!publicationMedia.some((media) => media.type === "video"))
			context.addIssue({ code: "custom", path: ["media"], message: "Se requiere un video capturado." });

		if (!evidenceMedia.some((media) => media.type === "imagen"))
			context.addIssue({
				code: "custom",
				path: ["media"],
				message: "Se requiere una fotografía como evidencia.",
			});

		if (!evidenceMedia.some((media) => media.type === "video"))
			context.addIssue({ code: "custom", path: ["media"], message: "Se requiere un video como evidencia." });
	});

export const ProductDraftInputSchema = z.object({
	ownerId: z.number().int().positive(),
	siteId: z.number().int().positive(),
	categoryId: z.number().int().positive().optional(),
	title: z.string().trim().max(160).optional(),
	description: z.string().trim().optional(),
	mode: PublicationModeSchema.optional(),
	salePrice: z.number().nonnegative().nullable().optional(),
	referenceValue: z.number().nonnegative().nullable().optional(),
	attributes: z.record(z.string(), z.string()).optional(),
	media: z.array(ProductMediaSchema).optional(),
});

export const ProductDraftSchema = z.object({
	id: z.number().int().positive(),
	ownerId: z.number().int().positive(),
	siteId: z.number().int().positive(),
	categoryId: z.number().int().positive().optional(),
	title: z.string(),
	description: z.string(),
	mode: PublicationModeSchema,
	salePrice: z.number().nonnegative().nullable(),
	referenceValue: z.number().nonnegative().nullable(),
	attributes: z.record(z.string(), z.string()),
	status: z.literal("borrador"),
	media: z.array(ProductMediaSchema),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime().nullable(),
});

export const ProductFiltersSchema = z.object({
	search: z.string().optional(),
	siteId: z.number().int().positive().optional(),
	categoryId: z.number().int().positive().optional(),
	mode: PublicationModeSchema.optional(),
});

// Inferencias
export type PublicationMode = z.infer<typeof PublicationModeSchema>;
export type ProductStatus = z.infer<typeof ProductStatusSchema>;
export type MediaType = z.infer<typeof MediaTypeSchema>;
export type ProductMedia = z.infer<typeof ProductMediaSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type ProductDraft = z.infer<typeof ProductDraftSchema>;
export type ProductDraftInput = z.input<typeof ProductDraftInputSchema>;
export type ProductFilters = z.infer<typeof ProductFiltersSchema>;
