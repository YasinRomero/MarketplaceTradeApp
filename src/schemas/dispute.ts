import { OperationTypeSchema } from "./operation";
import { z } from "zod";

export const DisputeStatusSchema = z.enum(["abierta", "en_revision", "resuelta"]);

export const DisputeDecisionSchema = z.enum([
	"liberar_respaldo",
	"devolver_fondos",
	"distribuir_fondos",
	"devolver_productos",
]);

export const DisputeEvidenceInputSchema = z.object({
	type: z.enum(["imagen", "video"]),
	url: z.string().trim().min(1).max(500),
});

export const DisputeInputSchema = z.object({
	type: OperationTypeSchema,
	transactionId: z.number().int().positive(),
	claimantId: z.number().int().positive(),
	reason: z.string().trim().min(1).max(2000),
	evidences: z.array(DisputeEvidenceInputSchema).max(20).optional().default([]),
});

export const DisputeSchema = z.object({
	id: z.number().int().positive(),
	transactionId: z.number().int().positive(),
	claimantId: z.number().int().positive(),
	moderatorId: z.number().int().positive().nullable(),
	reason: z.string().trim().min(1).max(2000),
	status: DisputeStatusSchema,
	decision: DisputeDecisionSchema.nullable(),
	resolution: z.string().max(2000).nullable(),
	requiresProductReturn: z.boolean(),
	createdAt: z.iso.datetime(),
	resolvedAt: z.iso.datetime().nullable(),
});

export const DisputeEvidenceSchema = DisputeEvidenceInputSchema.extend({
	id: z.number().int().positive(),
	disputeId: z.number().int().positive(),
	userId: z.number().int().positive(),
	createdAt: z.iso.datetime(),
});

export const DisputeAssignmentSchema = z.object({
	disputeId: z.number().int().positive(),
	moderatorId: z.number().int().positive(),
});

export const DisputeResolutionSchema = z.object({
	disputeId: z.number().int().positive(),
	moderatorId: z.number().int().positive(),
	decision: DisputeDecisionSchema,
	resolution: z.string().trim().min(1).max(2000),
	requiresProductReturn: z.boolean().optional().default(false),
});

// Inferencias
export type DisputeStatus = z.infer<typeof DisputeStatusSchema>;
export type DisputeDecision = z.infer<typeof DisputeDecisionSchema>;
export type DisputeEvidenceInput = z.infer<typeof DisputeEvidenceInputSchema>;
export type DisputeInput = z.input<typeof DisputeInputSchema>;
export type Dispute = z.infer<typeof DisputeSchema>;
export type DisputeEvidence = z.infer<typeof DisputeEvidenceSchema>;
export type DisputeResolutionInput = z.input<typeof DisputeResolutionSchema>;
