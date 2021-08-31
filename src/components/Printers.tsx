import { useEffect, useState } from 'react';
import { Card, Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useAppSelector } from '../app/hooks';

import {
    getDefaultPrinter,
    getPrinterList,
    IPrinter,
    printLabel,
    setDefaultPrinter,
} from '../data/services/LocalPrinter';
import { IIdentity, selectIdentity } from '../features/identity/identitySlice';
import TableGrid from './grid/TableGrid';

export default function PrinterList() {
    // State
    const [error, setError] = useState<string>('');
    const [printerList, setPrinterList] = useState<IPrinter[]>([]);
    const [isPrinterListLoaded, setIsPrinterListLoaded] = useState(false);
    const [currentPrinter, setCurrentPrinter] = useState<IPrinter | undefined>(
        undefined,
    );
    const [isCurrentPrinterLoaded, setIsCurrentPrinterLoaded] = useState(false);

    const identity: IIdentity = useAppSelector(selectIdentity);

    useEffect(() => {
        getPrinterList(setPrinterList, setIsPrinterListLoaded, setError);
    }, []);

    useEffect(() => {
        getDefaultPrinter(
            setCurrentPrinter,
            setIsCurrentPrinterLoaded,
            setError,
        );
    }, [isCurrentPrinterLoaded]);

    return (
        <Container>
            <h1>Printers</h1>
            <Card>
                <Card.Body>
                    <Card.Title>
                        Select the printer to use from the list of available
                        printers on your machine.
                    </Card.Title>
                    <p className="fw-light fst-italic text-dark">
                        {currentPrinter ? (
                            <>
                                <p>
                                    Your current printer is{' '}
                                    {currentPrinter.printerName}.
                                </p>
                                <Button
                                    onClick={() => {
                                        let supplierCode =
                                            identity.supplierCode || '';
                                        console.log(supplierCode);
                                        let serial = 0;
                                        console.log(serial);
                                        let printerDriver =
                                            currentPrinter?.printerDriver || '';
                                        console.log(printerDriver);
                                        printLabel(
                                            supplierCode,
                                            serial,
                                            printerDriver,
                                        );
                                    }}
                                >
                                    Print Sample
                                </Button>
                            </>
                        ) : (
                            'No current printer defined.'
                        )}
                    </p>
                    {error ? (
                        <span>'Error: ' {error}</span>
                    ) : isPrinterListLoaded ? (
                        <Container className="pt-3 mx-0 px-0">
                            <TableGrid
                                singleRowSelect={true}
                                columns={[
                                    {
                                        columnName: 'printerName',
                                        columnHeader: 'Printer Name',
                                    },
                                    {
                                        columnName: 'printerDriver',
                                        columnHeader: 'Driver Name',
                                    },
                                ]}
                                data={printerList}
                                singleSelectedRow={printerList.find(
                                    (printer) =>
                                        printer.printerName ===
                                        currentPrinter?.printerName,
                                )}
                                rowSelectionHandler={(printer: IPrinter) => {
                                    setDefaultPrinter(
                                        printer,
                                        setCurrentPrinter,
                                        setIsCurrentPrinterLoaded,
                                        setError,
                                    );
                                }}
                            />
                        </Container>
                    ) : (
                        <Card.Text>Loading...</Card.Text>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}
