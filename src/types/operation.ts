import { OperationType } from "@/schemas/operation";

export interface OperationReference {
	type: OperationType;
	id: number;
}
