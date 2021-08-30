import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import FormInputSelect from './forms/FormInputSelect';
import Button from 'react-bootstrap/Button';

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

import SupplierLotList, { ISupplierLot } from '../data/SupplierLotList';
import PreObjectList, { IPreObject } from '../data/PreObjectList';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { IIdentity, selectIdentity } from '../features/identity/identitySlice';
import { useAppSelector } from '../app/hooks';
import TableGrid from './grid/TableGrid';
import { IPrinter, printLabels } from '../data/services/LocalPrinter';
import { saveLotQuantityChange } from '../data/services/PreObjects';

export default function ReprintLabels() {
    // State
    const [error, setError] = useState<string>('');
    const [isLotListLoaded, setIsLotListLoaded] = useState(false);
    const [supplierLotList, setSupplierLotList] = useState<ISupplierLot[]>([]);
    const [lotNumber, setLotNumber] = useState<string>('');
    const [preObjectList, setPreObjectList] = useState<IPreObject[]>([]);
    const [selectedPreObjectList, setSelectedPreObjectList] = useState<
        IPreObject[]
    >([]);
    const [isPreObjectListLoaded, setIsPreObjectListLoaded] = useState(false);
    const [currentPrinter, setCurrentPrinter] = useState<IPrinter | undefined>(
        undefined,
    );
    const [isCurrentPrinterLoaded, setIsCurrentPrinterLoaded] = useState(false);

    const identity: IIdentity = useAppSelector(selectIdentity);

    useEffect(() => {
        if (process.env['REACT_APP_API'] === 'Enabled') {
            axios
                .get<ISupplierLot[]>(
                    `https://www.fxsupplierportal.com/api/SupplierLots?supplierCode=${identity.supplierCode}`,
                )
                .then((response) => {
                    setSupplierLotList(response.data);
                    setIsLotListLoaded(true);
                })
                .catch((ex) => {
                    let error =
                        ex.code === 'ECONNABORTED'
                            ? 'A timeout has occurred'
                            : ex.response?.status === 404
                            ? 'Resource not found'
                            : 'An unexpected error has occurred';
                    setError(error);
                    setIsLotListLoaded(false);
                });
            return;
        }
        setSupplierLotList(SupplierLotList());
        setIsLotListLoaded(true);
    }, [identity.supplierCode, isLotListLoaded]);

    useEffect(() => {
        if (process.env['REACT_APP_API'] === 'Enabled') {
            axios
                .get<IPreObject[]>(
                    `https://www.fxsupplierportal.com/api/PreObjects/Lot?supplierCode=${identity.supplierCode}&lotNumber=${lotNumber}`,
                )
                .then((response) => {
                    setPreObjectList(response.data);
                    setIsPreObjectListLoaded(true);
                })
                .catch((ex) => {
                    let error =
                        ex.code === 'ECONNABORTED'
                            ? 'A timeout has occurred'
                            : ex.response?.status === 404
                            ? 'Resource not found'
                            : 'An unexpected error has occurred';
                    setError(error);
                    setIsPreObjectListLoaded(false);
                });
            return;
        }
        setPreObjectList(PreObjectList('lot'));
        setIsPreObjectListLoaded(true);
    }, [identity.supplierCode, isPreObjectListLoaded, lotNumber]);

    useEffect(() => {
        axios
            .get<IPrinter>('/api/currentprinter')
            .then((response) => {
                setCurrentPrinter(response.data);
                setIsCurrentPrinterLoaded(true);
            })
            .catch((ex) => {
                let error =
                    ex.code === 'ECONNABORTED'
                        ? 'A timeout has occurred'
                        : ex.response.status === 404
                        ? 'Resource Not Found'
                        : 'An unexpected error has occurred';

                setError(error);
                setIsCurrentPrinterLoaded(false);
            });
    }, [isCurrentPrinterLoaded]);

    const lotSelectionHandler = (e: string | null) => {
        setLotNumber(e ? e : '');
        setIsPreObjectListLoaded(false);
    };

    return (
        <>
            <Container>
                <h1 className="header">Reprint Labels</h1>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            Select a previous lot number and select labels to
                            reprint.
                        </Card.Title>
                        {isLotListLoaded ? (
                            <Form>
                                <FormInputSelect
                                    controlId="formSupplierParts"
                                    label="Lot:"
                                    values={supplierLotList.map(
                                        (supplierLot) => supplierLot.lotNumber,
                                    )}
                                    selectionHandler={lotSelectionHandler}
                                ></FormInputSelect>
                            </Form>
                        ) : (
                            <Card.Text>Loading...</Card.Text>
                        )}
                    </Card.Body>
                </Card>
                {lotNumber ? (
                    <Card className="mt-5">
                        <Card.Body>
                            <Card.Title>
                                (Optionally) Edit the inventory in this batch to
                                adjust quantities and/or lot numbers. Then
                                select and print labels.
                            </Card.Title>
                            {isPreObjectListLoaded ? (
                                <>
                                    <Button
                                        onClick={() => {
                                            let supplierCode =
                                                identity.supplierCode || '';
                                            console.log(supplierCode);
                                            let serialList =
                                                selectedPreObjectList
                                                    .map((po) => po.serial)
                                                    .join();
                                            console.log(serialList);
                                            let printerDriver =
                                                currentPrinter?.printerDriver ||
                                                '';
                                            console.log(printerDriver);
                                            printLabels(
                                                supplierCode,
                                                serialList,
                                                printerDriver,
                                            );
                                        }}
                                    >
                                        Print {selectedPreObjectList.length}{' '}
                                        select labels
                                    </Button>
                                    <Form>
                                        <TableGrid
                                            multiRowCheckboxSelect
                                            editableRows
                                            columns={[
                                                {
                                                    columnName: 'serial',
                                                    columnHeader: 'Serial',
                                                    readonly: true,
                                                },
                                                {
                                                    columnName:
                                                        'supplierPartCode',
                                                    columnHeader: 'Part',
                                                    readonly: true,
                                                },
                                                {
                                                    columnName: 'lotNumber',
                                                    columnHeader: 'Lot',
                                                },
                                                {
                                                    columnName: 'quantity',
                                                    columnHeader: 'Qty',
                                                },
                                                {
                                                    columnName:
                                                        'labelFormatName',
                                                    columnHeader: 'Label',
                                                    readonly: true,
                                                },
                                            ]}
                                            data={preObjectList}
                                            rowUpdateHandler={(
                                                originalRow: IPreObject,
                                                modifiedRow: IPreObject,
                                            ) => {
                                                const rowIndex =
                                                    preObjectList.findIndex(
                                                        (preObject) =>
                                                            preObject.serial ===
                                                            originalRow.serial,
                                                    );
                                                if (rowIndex >= 0) {
                                                    return saveLotQuantityChange(
                                                        preObjectList,
                                                        rowIndex,
                                                        modifiedRow,
                                                        setPreObjectList,
                                                        setError,
                                                    );
                                                }
                                                return false;
                                            }}
                                            multirowSelectionHandler={(
                                                selectedRows: Array<IPreObject>,
                                            ) => {
                                                setSelectedPreObjectList(
                                                    selectedRows,
                                                );
                                            }}
                                        />
                                    </Form>
                                </>
                            ) : (
                                <Card.Text>Loading...</Card.Text>
                            )}
                        </Card.Body>
                    </Card>
                ) : (
                    <></>
                )}
                {error ? (
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
                )}
            </Container>
        </>
    );
}
