export interface IPart {
    partCode: string;
    partDescription: string;
    unitWeight: number;
    weightTolerance: number;
    standardPack: number;
    specialInstructions?: string;
    requiresFinalInspection: boolean;
    deflashMethod?: 'MACHINE' | 'TEARTRIM';
}
