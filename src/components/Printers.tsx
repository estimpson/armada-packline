import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Card,
    Col,
    Container,
    ListGroup,
    ListGroupItem,
    Row,
} from 'react-bootstrap';

import { Link } from 'react-router-dom';
import {
    getDefaultPrinter,
    getPrinterList,
    IPrinter,
    setDefaultPrinter,
} from '../app/services/LocalPrinter';
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
                        {currentPrinter
                            ? `Your current printer is ${currentPrinter.printerName}.`
                            : 'No current printer defined.'}
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
