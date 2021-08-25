import axios from 'axios';

export interface IPrinter {
    printerName: string;
    printerDriver: string;
}
interface ILabelPacket {
    serial: number;
    labelData: string;
}
export function printLabels(
    supplierCode: string,
    serialList: string,
    printerDriver: string,
) {
    if (process.env['REACT_APP_API'] === 'Enabled') {
        let queryString = `https://www.fxsupplierportal.com/api/PreObjects/Labels?supplierCode=${encodeURIComponent(
            supplierCode,
        )}&serialList=${encodeURIComponent(
            serialList,
        )}&printDriver=${encodeURIComponent(printerDriver)}`;
        console.log(queryString);
        axios
            .get<ILabelPacket[]>(queryString)
            .then((response) => {
                let labelPackets = response.data;
                labelPackets.forEach((labelPacket) => {
                    axios
                        .post(`/api/printlabel`, labelPacket.labelData)
                        .then(() => console.log(labelPacket.serial));
                    console.log(labelPacket);
                });
            })
            .catch((ex) => {
                let error =
                    ex.code === 'ECONNABORTED'
                        ? 'A timeout has occurred'
                        : ex.response?.status === 404
                        ? 'Resource not found'
                        : 'An unexpected error has occurred';
                console.log(error);
            });
        return;
    }
}
