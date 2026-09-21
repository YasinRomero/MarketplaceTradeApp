import { z } from "zod";

export const PublicationModeSchema = z.enum(["venta", "intercambio", "ambas"]);
export const ProductStatusSchema = z.enum(["borrador", "activo", "reservado", "finalizado", "inactivo"]);
export const ProductMediaSchema = z.object({
	id: z.number().int().positive(),
	productId: z.number().int().positive(),
	type: z.enum(["imagen", "video"]),
	url: z.string().min(1),
	capturedAt: z.string().datetime(),
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
		if ((product.mode === "venta" || product.mode === "ambas") && product.salePrice === null) {
			context.addIssue({ code: "custom", path: ["salePrice"], message: "El precio de venta es obligatorio." });
		}
		if ((product.mode === "intercambio" || product.mode === "ambas") && product.referenceValue === null) {
			context.addIssue({
				code: "custom",
				path: ["referenceValue"],
				message: "El valor referencial es obligatorio.",
			});
		}
		if (!product.media.some((media) => media.type === "imagen")) {
			context.addIssue({ code: "custom", path: ["media"], message: "Se requiere una fotografía capturada." });
		}
		if (!product.media.some((media) => media.type === "video")) {
			context.addIssue({ code: "custom", path: ["media"], message: "Se requiere un video capturado." });
		}
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

export type ProductDraftInputValidated = z.infer<typeof ProductDraftInputSchema>;
