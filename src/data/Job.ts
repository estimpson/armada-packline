export interface IJob {
    step: string;
    part?: string;
    instructions?: string;
    acknowledged?: boolean;
    quantity?: number;
    pieceWeight?: number;
    valid?: boolean;
    operator?: string;
    machine?: string;
    jobInProgress?: boolean;
    standardPack?: number;
    boxes?: number;
    partialBoxQuantity?: number;
    objectList?: {
        serial: number;
        quantity: number;
        partial: boolean;
    }[];
}
