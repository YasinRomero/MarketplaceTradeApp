import { ExchangeTransactionStatus, OperationType } from "@/schemas/operation";
import { ProductMedia } from "@/schemas/product";

export interface DisputeOperationContext {
	type: OperationType;
	status: ExchangeTransactionStatus;
	participantIds: number[];
	productIds: number[];
	price: number | null;
	referenceValues: number[];
	additionalAmount: number;
	evidence: OperationEvidenceReference | null;
}

export interface OperationEvidenceReference {
	media: ProductMedia[];
	referenceValue?: number | null;
	price?: number;
}
