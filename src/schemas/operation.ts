import { z } from "zod";

export const ExchangeTransactionStatusSchema = z.enum([
	"pendiente_respaldo",
	"activa",
	"realizada",
	"completada",
	"cancelacion_pendiente",
	"cancelada",
	"disputa",
]);
export const ConformitySourceSchema = z.enum(["explicita", "vencimiento"]);
export const OperationTypeSchema = z.enum(["venta", "intercambio"]);

export type ExchangeTransactionStatus = z.infer<typeof ExchangeTransactionStatusSchema>;
export type ConformitySource = z.infer<typeof ConformitySourceSchema>;
export type OperationType = z.infer<typeof OperationTypeSchema>;
