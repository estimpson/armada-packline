export interface preObject {
  serial: number;
  status: number;
  type: number;
  supplierCode: string;
  supplierPartCode: string;
  internalPartCode: string;
  quantity: number;
  lotNumber: string;
  labelFormatName: string;
  rowCreateDT: Date;
  rowModifiedDT: Date;
}

export default function PreObjectList(from: "lot"): preObject[] {
  switch (from) {
    case "lot":
      return [
        {
          serial: 912721,
          status: 0,
          type: 0,
          supplierCode: "ROC0010",
          supplierPartCode: "9C34 5775 AA",
          internalPartCode: "3035-RAW",
          quantity: 100,
          lotNumber: "12345",
          labelFormatName: "RAW",
          rowCreateDT: new Date("2018-09-19T15:00:38.22"),
          rowModifiedDT: new Date("2018-09-19T15:00:38.22")
        },
        {
          serial: 912722,
          status: 0,
          type: 0,
          supplierCode: "ROC0010",
          supplierPartCode: "9C34 5775 AA",
          internalPartCode: "3035-RAW",
          quantity: 100,
          lotNumber: "12345",
          labelFormatName: "RAW",
          rowCreateDT: new Date("2018-09-19T15:00:38.22"),
          rowModifiedDT: new Date("2018-09-19T15:00:38.22")
        },
        {
          serial: 912723,
          status: 0,
          type: 0,
          supplierCode: "ROC0010",
          supplierPartCode: "9C34 5775 AA",
          internalPartCode: "3035-RAW",
          quantity: 100,
          lotNumber: "12345",
          labelFormatName: "RAW",
          rowCreateDT: new Date("2018-09-19T15:00:38.22"),
          rowModifiedDT: new Date("2018-09-19T15:00:38.22")
        },
        {
          serial: 912724,
          status: 0,
          type: 0,
          supplierCode: "ROC0010",
          supplierPartCode: "9C34 5775 AA",
          internalPartCode: "3035-RAW",
          quantity: 100,
          lotNumber: "12345",
          labelFormatName: "RAW",
          rowCreateDT: new Date("2018-09-19T15:00:38.22"),
          rowModifiedDT: new Date("2018-09-19T15:00:38.22")
        },
        {
          serial: 912725,
          status: 0,
          type: 0,
          supplierCode: "ROC0010",
          supplierPartCode: "9C34 5775 AA",
          internalPartCode: "3035-RAW",
          quantity: 100,
          lotNumber: "12345",
          labelFormatName: "RAW",
          rowCreateDT: new Date("2018-09-19T15:00:38.22"),
          rowModifiedDT: new Date("2018-09-19T15:00:38.22")
        }
      ];
  }
}
