import { useEffect, useState } from 'react';
import { Card, Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useAppDispatch, useAppSelector } from '../app/hooks';

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
    const [printerList, setPrinterList] = useState<IPrinter[]>([]);
    const [isPrinterListLoaded, setIsPrinterListLoaded] = useState(false);
    const [currentPrinter, setCurrentPrinter] = useState<IPrinter | undefined>(
        undefined,
    );
    const [isCurrentPrinterLoaded, setIsCurrentPrinterLoaded] = useState(false);

    const identity: IIdentity = useAppSelector(selectIdentity);

    useEffect(() => {
        getPrinterList(setPrinterList, setIsPrinterListLoaded);
    }, []);

    useEffect(() => {
        getDefaultPrinter(setCurrentPrinter, setIsCurrentPrinterLoaded);
    }, [isCurrentPrinterLoaded]);

    return (
        <>
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
                                                currentPrinter?.printerDriver ||
                                                '';
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
                        {isPrinterListLoaded ? (
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
                                    rowSelectionHandler={(
                                        printer: IPrinter,
                                    ) => {
                                        setDefaultPrinter(
                                            printer,
                                            setCurrentPrinter,
                                            setIsCurrentPrinterLoaded,
                                        );
                                    }}
                                />
                            </Container>
                        ) : (
                            <Card.Text>Loading...</Card.Text>
                        )}
                    </Card.Body>
                </Card>
                {/* {error ? (
                    <Toast bg="danger" onClose={() => setError('')}>
                        <Toast.Header>
                            <img
                                src="favicon.png"
                                alt=""
                                style={{ width: 24 }}
                            />
                            <strong className="me-auto">
                                Aztec Supplier Portal
                            </strong>
                        </Toast.Header>
                        <Toast.Body className="danger">{error}</Toast.Body>
                    </Toast>
                ) : (
                    <></>
                )} */}
            </Container>
        </>
    );
}
