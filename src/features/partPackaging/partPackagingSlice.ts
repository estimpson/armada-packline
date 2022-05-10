// part packaging is a child of the part and doesn't contain any independent logic

export interface IPartPackaging {
    partCode: string;
    packageCode: string;
    packageDescription: string;
    standardPack: number;
    specialInstructions?: string;
}
