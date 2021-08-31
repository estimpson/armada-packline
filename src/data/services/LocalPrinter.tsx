import axios from 'axios';

export interface IPrinter {
    printerName: string;
    printerDriver: string;
}
interface ILabelPacket {
    serial: number;
    labelData: string;
}

export function printLabel(
    supplierCode: string,
    serial: number,
    printerDriver: string,
) {
    if (process.env['REACT_APP_API'] === 'Enabled') {
        let queryString = `https://www.fxsupplierportal.com/api/PreObjects/LabelData?supplierCode=${encodeURIComponent(
            supplierCode,
        )}&serialNumber=${encodeURIComponent(
            serial,
        )}&printDriver=${encodeURIComponent(printerDriver)}`;
        console.log(queryString);
        axios
            .get<ILabelPacket>(queryString)
            .then((response) => {
                let labelPacket = response.data;
                axios
                    .post(`/api/printlabel`, labelPacket.labelData)
                    .then(() => console.log(labelPacket.serial));
                console.log(labelPacket);
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

export function getDefaultPrinter(
    setCurrentPrinter: (printer: IPrinter) => void,
    setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
) {
    axios
        .get<IPrinter>('/api/currentprinter')
        .then((response) => {
            setCurrentPrinter(response.data);
            setIsLoaded(true);
        })
        .catch((ex) => {
            let error =
                ex.code === 'ECONNABORTED'
                    ? 'A timeout has occurred'
                    : ex.response.status === 404
                    ? 'Resource Not Found'
                    : 'An unexpected error has occurred';

            setError(error);
            setIsLoaded(false);
        });
}

export function setDefaultPrinter(
    printer: IPrinter,
    setCurrentPrinter: (printer: IPrinter) => void,
    setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
) {
    axios
        .patch<boolean>(
            `/api/setcurrentprinter?printerName=${encodeURIComponent(
                printer.printerName,
            )}`,
        )
        .then((response) => {
            setCurrentPrinter(printer);
            setIsLoaded(true);
        })
        .catch((ex) => {
            let error =
                ex.code === 'ECONNABORTED'
                    ? 'A timeout has occurred'
                    : ex.response.status === 404
                    ? 'Resource Not Found'
                    : 'An unexpected error has occurred';

            setError(error);
            setIsLoaded(false);
        });
}

export function getPrinterList(
    setPrinters: (printerList: IPrinter[]) => void,
    setIsLoaded: (printerListIsLoaded: boolean) => void,
    setError: React.Dispatch<React.SetStateAction<string>>,
) {
    axios
        .get<IPrinter[]>('/api/printerlist')
        .then((response) => {
            setPrinters(response.data);
            setIsLoaded(true);
        })
        .catch((ex) => {
            let error =
                ex.code === 'ECONNABORTED'
                    ? 'A timeout has occurred'
                    : ex.response.status === 404
                    ? 'Resource Not Found'
                    : 'An unexpected error has occurred';

            setError(error);
            setIsLoaded(false);
        });
}
