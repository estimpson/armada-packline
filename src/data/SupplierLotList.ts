export interface ISupplierLot {
    supplierCode: string;
    lotNumber: string;
    supplierPartList: string;
    internalPartList: string;
    serialList: string;
    totalQuantity: number;
    lotCreateDT: string;
}

export default function SupplierLotList(): ISupplierLot[] {
    return [
        {
            supplierCode: 'ROC0010',
            lotNumber: '?0',
            supplierPartList: '23212-F4010',
            internalPartList: '3689 - RAW',
            serialList: '1056059, 1056061',
            totalQuantity: 2,
            lotCreateDT: '2021-08-03T15:25:02.657',
        },
        {
            supplierCode: 'ROC0010',
            lotNumber: '12345',
            supplierPartList: '9C34 5775 AA',
            internalPartList: '3035-RAW',
            serialList: '912721, 912722, 912723, 912724, 912725',
            totalQuantity: 500,
            lotCreateDT: '2018-09-19T15:00:38.22',
        },
        {
            supplierCode: 'ROC0010',
            lotNumber: '12988',
            supplierPartList: '9C34 5775 AA',
            internalPartList: '3035-RAW',
            serialList: '996103, 996104',
            totalQuantity: 354,
            lotCreateDT: '2019-12-09T15:54:55.697',
        },
        {
            supplierCode: 'ROC0010',
            lotNumber: '18242',
            supplierPartList: '9C34 5775 AA',
            internalPartList: '3035-RAW',
            serialList: '914687, 914894',
            totalQuantity: 380,
            lotCreateDT: '2018-09-28T15:57:36.673',
        },
        {
            supplierCode: 'ROC0010',
            lotNumber: '18243',
            supplierPartList: '9C34 5775 AA',
            internalPartList: '3035-RAW',
            serialList: '914898, 914899',
            totalQuantity: 402,
            lotCreateDT: '2018-10-01T11:07:29.29',
        },
        {
            supplierCode: 'ROC0010',
            lotNumber: '18249',
            supplierPartList: '9C34 5775 AA',
            internalPartList: '3035-RAW',
            serialList:
                '914900, 914895, 914896, 914897, 914890, 914685, 914686',
            totalQuantity: 1268,
            lotCreateDT: '2018-09-28T15:55:59.527',
        },
        {
            supplierCode: 'ROC0010',
            lotNumber: '18268',
            supplierPartList: '7C34-5700-AA, 9C34 5775 AA',
            internalPartList: '2633-RAW, 3035-RAW',
            serialList:
                '914901, 914902, 914903, 914904, 914905, 914906, 914907, 914908, 914909, 914910, 915404, 915405, 915406, 915407, 915408, 915409, 915410, 918030, 918031, 918032, 918033, 918034, 918035, 918036, 918059, 965663',
            totalQuantity: 5117,
            lotCreateDT: '2018-10-01T11:08:49.503',
        },
    ];
}
