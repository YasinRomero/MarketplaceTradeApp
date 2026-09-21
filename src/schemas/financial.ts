import { z } from "zod";

export const FinancialMovementTypeSchema = z.enum(["retencion", "liberacion", "anulacion", "reembolso", "comision"]);

export const FinancialMovementConceptSchema = z.enum(["respaldo_producto", "monto_adicional", "comision"]);

export const FinancialMovementStatusSchema = z.enum(["pendiente", "confirmado", "fallido"]);

export const FinancialMovementSchema = z.object({
	id: z.number().int().positive(),
	transactionId: z.number().int().positive(),
	sourceUserId: z.number().int().positive(),
	destinationUserId: z.number().int().positive(),
	type: FinancialMovementTypeSchema,
	concept: FinancialMovementConceptSchema,
	amount: z.number().finite().nonnegative(),
	status: FinancialMovementStatusSchema,
	provider: z.string().max(100).nullable(),
	providerReference: z.string().max(255).nullable(),
	createdAt: z.iso.datetime(),
	processedAt: z.iso.datetime().nullable(),
	recognizedAt: z.iso.datetime().nullable(),
});

// Inferencias
export type FinancialMovementType = z.infer<typeof FinancialMovementTypeSchema>;
export type FinancialMovementConcept = z.infer<typeof FinancialMovementConceptSchema>;
export type FinancialMovementStatus = z.infer<typeof FinancialMovementStatusSchema>;
export type FinancialMovement = z.infer<typeof FinancialMovementSchema>;
