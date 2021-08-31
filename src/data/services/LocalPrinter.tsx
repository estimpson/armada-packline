import axios from 'axios';
import { store } from '../../app/store';
import {
    applicationErrorOccurred,
    ApplicationErrorType,
} from '../../features/applicationError/applicationErrorSlice';
import { AxiosErrorHandler } from './AxiosErrorHandler';

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
        const queryString = `https://www.fxsupplierportal.com/api/PreObjects/LabelData?supplierCode=${encodeURIComponent(
            supplierCode,
        )}&serialNumber=${encodeURIComponent(
            serial,
        )}&printDriver=${encodeURIComponent(printerDriver)}`;
        console.log(queryString);
        axios
            .get<ILabelPacket>(queryString)
            .then((response) => {
                const labelPacket = response.data;
                if (labelPacket.labelData) {
                    axios
                        .post(`/api/printlabel`, labelPacket.labelData)
                        .then(() => console.log(labelPacket.serial));
                    console.log(labelPacket);
                } else {
                    store.dispatch(
                        applicationErrorOccurred({
                            type: ApplicationErrorType.Unknown,
                            message: `Label definition for ${printerDriver} not found.  Please choose a different printer.`,
                        }),
                    );
                }
            })
            .catch((ex) => AxiosErrorHandler(ex, queryString));
        return;
    }
}

export function printLabels(
    supplierCode: string,
    serialList: string,
    printerDriver: string,
) {
    if (process.env['REACT_APP_API'] === 'Enabled') {
        const queryString = `https://www.fxsupplierportal.com/api/PreObjects/Labels?supplierCode=${encodeURIComponent(
            supplierCode,
        )}&serialList=${encodeURIComponent(
            serialList,
        )}&printDriver=${encodeURIComponent(printerDriver)}`;
        console.log(queryString);
        axios
            .get<ILabelPacket[]>(queryString)
            .then((response) => {
                const labelPackets = response.data;
                labelPackets.forEach((labelPacket) => {
                    axios
                        .post(`/api/printlabel`, labelPacket.labelData)
                        .then(() => console.log(labelPacket.serial));
                    console.log(labelPacket);
                });
            })
            .catch((ex) => AxiosErrorHandler(ex, queryString));
        return;
    }
}

export function getDefaultPrinter(
    setCurrentPrinter: (printer: IPrinter) => void,
    setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>,
) {
    const queryString = '/api/currentprinter';
    axios
        .get<IPrinter>(queryString)
        .then((response) => {
            setCurrentPrinter(response.data);
            setIsLoaded(true);
        })
        .catch((ex) => AxiosErrorHandler(ex, queryString));
}

export function setDefaultPrinter(
    printer: IPrinter,
    setCurrentPrinter: (printer: IPrinter) => void,
    setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>,
) {
    const queryString = `/api/setcurrentprinter?printerName=${encodeURIComponent(
        printer.printerName,
    )}`;
    axios
        .patch<boolean>(queryString)
        .then((response) => {
            setCurrentPrinter(printer);
            setIsLoaded(true);
        })
        .catch((ex) => AxiosErrorHandler(ex, queryString));
}

export function getPrinterList(
    setPrinters: (printerList: IPrinter[]) => void,
    setIsLoaded: (printerListIsLoaded: boolean) => void,
) {
    const queryString = '/api/printerlist';
    axios
        .get<IPrinter[]>(queryString)
        .then((response) => {
            setPrinters(response.data);
            setIsLoaded(true);
        })
        .catch((ex) => AxiosErrorHandler(ex, queryString));
}
