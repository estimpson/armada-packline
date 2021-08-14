export interface ISupplierPart {
    supplierCode: string;
    supplierName: string;
    supplierPartCode: string;
    status: 0;
    supplierStdPack: number;
    internalPartCode: string;
    description: string;
    partClass: 'Purch';
    partSubClass: 'Raw' | 'Wip' | 'Fin';
    hasBlanketPO: 0 | 1;
    labelFormatName: 'NOLABEL' | 'RAW' | 'WIP' | 'FIN';
}

export default function SupplierPartList(): ISupplierPart[] {
    return [
        {
            supplierCode: 'ROC0010',
            supplierName: 'ROCHESTER METAL PRODUCTS',
            supplierPartCode: '12315-F401200',
            status: 0,
            supplierStdPack: 1,
            internalPartCode: '3974 - RAW',
            description: '12315-F401200',
            partClass: 'Purch',
            partSubClass: 'Raw',
            hasBlanketPO: 1,
            labelFormatName: 'NOLABEL',
        },
        {
            supplierCode: 'ROC0010',
            supplierName: 'ROCHESTER METAL PRODUCTS',
            supplierPartCode: '23212-F401000',
            status: 0,
            supplierStdPack: 1,
            internalPartCode: '3689 - RAW',
            description: 'Brkt Fuel Pipe Protector',
            partClass: 'Purch',
            partSubClass: 'Raw',
            hasBlanketPO: 1,
            labelFormatName: 'NOLABEL',
        },
        {
            supplierCode: 'ROC0010',
            supplierName: 'ROCHESTER METAL PRODUCTS',
            supplierPartCode: '48382-YY010',
            status: 0,
            supplierStdPack: 1,
            internalPartCode: '3938 - RAW',
            description: 'Toyota 3938 Brkt',
            partClass: 'Purch',
            partSubClass: 'Raw',
            hasBlanketPO: 1,
            labelFormatName: 'RAW',
        },
        {
            supplierCode: 'ROC0010',
            supplierName: 'ROCHESTER METAL PRODUCTS',
            supplierPartCode: '52461 06030 1',
            status: 0,
            supplierStdPack: 1,
            internalPartCode: '3944 - RAW',
            description: 'Damper',
            partClass: 'Purch',
            partSubClass: 'Raw',
            hasBlanketPO: 1,
            labelFormatName: 'RAW',
        },
        {
            supplierCode: 'ROC0010',
            supplierName: 'ROCHESTER METAL PRODUCTS',
            supplierPartCode: '6C34 5598 AA',
            status: 0,
            supplierStdPack: 450,
            internalPartCode: '2503-RAW',
            description: 'SPACER',
            partClass: 'Purch',
            partSubClass: 'Raw',
            hasBlanketPO: 1,
            labelFormatName: 'FIN',
        },
        {
            supplierCode: 'ROC0010',
            supplierName: 'ROCHESTER METAL PRODUCTS',
            supplierPartCode: '7C34-5700-AA',
            status: 0,
            supplierStdPack: 1,
            internalPartCode: '2633-RAW',
            description: 'BRACKET',
            partClass: 'Purch',
            partSubClass: 'Raw',
            hasBlanketPO: 1,
            labelFormatName: 'NOLABEL',
        },
    ];
}
