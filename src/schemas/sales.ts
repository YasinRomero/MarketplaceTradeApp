import { ConformitySourceSchema, ExchangeTransactionStatusSchema } from "./operation";
import { z } from "zod";

export const SaleTransactionSchema = z.object({
	id: z.number().int().positive(),
	soldProductId: z.number().int().positive(),
	sellerId: z.number().int().positive(),
	buyerId: z.number().int().positive(),
	price: z.number().nonnegative(),
	commission: z.number().nonnegative(),
	sellerAmount: z.number().nonnegative(),
	status: ExchangeTransactionStatusSchema,
	sellerConfirmedAt: z.iso.datetime().nullable(),
	buyerConfirmedAt: z.iso.datetime().nullable(),
	deliveryCompletedAt: z.iso.datetime().nullable(),
	confirmationDeadlineAt: z.iso.datetime().nullable(),
	buyerConformityAt: z.iso.datetime().nullable(),
	buyerConformitySource: ConformitySourceSchema.nullable(),
	completedAt: z.iso.datetime().nullable(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime().nullable(),
});

// Inferencias
export type SaleTransaction = z.infer<typeof SaleTransactionSchema>;
