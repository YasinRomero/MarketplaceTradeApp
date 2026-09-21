import { ConformitySourceSchema, ExchangeTransactionStatusSchema } from "./operation";
import { z } from "zod";

export const ExchangeProposalStatusSchema = z.enum(["pendiente", "aceptada", "rechazada", "cancelada"]);

export const ExchangeProposalInputSchema = z.object({
	requestedProductId: z.number().int().positive(),
	offeredProductId: z.number().int().positive(),
	requesterId: z.number().int().positive(),
	additionalAmount: z.number().finite().nonnegative().optional().default(0),
});

export const ExchangeProposalSchema = z.object({
	id: z.number().int().positive(),
	requestedProductId: z.number().int().positive(),
	offeredProductId: z.number().int().positive(),
	requesterId: z.number().int().positive(),
	additionalAmount: z.number().finite().nonnegative(),
	status: ExchangeProposalStatusSchema,
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime().nullable(),
});

export const ExchangeTransactionSchema = z.object({
	id: z.number().int().positive(),
	exchangeProposalId: z.number().int().positive(),
	publishedProductId: z.number().int().positive(),
	offeredProductId: z.number().int().positive(),
	publisherId: z.number().int().positive(),
	requesterId: z.number().int().positive(),
	meetingSiteId: z.number().int().positive(),
	publishedProductValue: z.number().nonnegative(),
	offeredProductValue: z.number().nonnegative(),
	additionalAmount: z.number().nonnegative(),
	commissionPerParticipant: z.literal(2.5),
	status: ExchangeTransactionStatusSchema,
	meetingAt: z.iso.datetime().nullable(),
	exchangeCompletedAt: z.iso.datetime().nullable(),
	publisherConfirmedAt: z.iso.datetime().nullable(),
	requesterConfirmedAt: z.iso.datetime().nullable(),
	confirmationDeadlineAt: z.iso.datetime().nullable(),
	publisherConformityAt: z.iso.datetime().nullable(),
	requesterConformityAt: z.iso.datetime().nullable(),
	publisherConformitySource: ConformitySourceSchema.nullable(),
	requesterConformitySource: ConformitySourceSchema.nullable(),
	cancellationRequestedById: z.number().int().positive().nullable(),
	cancellationRequestedAt: z.iso.datetime().nullable(),
	cancellationReason: z.string().max(255).nullable(),
	cancelledAt: z.iso.datetime().nullable(),
	completedAt: z.iso.datetime().nullable(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime().nullable(),
});

// Inferencias
export type ExchangeProposalStatus = z.infer<typeof ExchangeProposalStatusSchema>;
export type ExchangeProposalInput = z.input<typeof ExchangeProposalInputSchema>;
export type ExchangeProposal = z.infer<typeof ExchangeProposalSchema>;
export type ExchangeTransaction = z.infer<typeof ExchangeTransactionSchema>;
