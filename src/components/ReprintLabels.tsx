import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormInputSelect from './forms/FormInputSelect';

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
import { Button } from 'react-bootstrap';

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
    }, [isLotListLoaded]);

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
    }, [isPreObjectListLoaded]);

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
                    </Card.Body>
                </Card>
                <Card className="mt-5">
                    <Card.Body>
                        <Card.Title>
                            (Optionally) Edit the inventory in this batch to
                            adjust quantities and/or lot numbers. Then select
                            and print labels.
                        </Card.Title>
                        <Button>
                            Print {selectedPreObjectList.length} select labels
                        </Button>
                        <Form>
                            <TableGrid
                                select
                                editableRows
                                columns={[
                                    {
                                        columnName: 'serial',
                                        columnHeader: 'Serial',
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
                                ]}
                                data={preObjectList}
                                rowUpdateHandler={(
                                    originalRow: IPreObject,
                                    modifiedRow: IPreObject,
                                ) => {
                                    const rowIndex = preObjectList.findIndex(
                                        (preObject) =>
                                            preObject.serial ===
                                            originalRow.serial,
                                    );
                                    if (rowIndex) {
                                        preObjectList[rowIndex] = modifiedRow;
                                        setPreObjectList(preObjectList);
                                        return true;
                                    }
                                    return false;
                                }}
                                rowSelectHandler={(
                                    selectedRows: Array<IPreObject>,
                                ) => {
                                    setSelectedPreObjectList(selectedRows);
                                }}
                            />
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}
