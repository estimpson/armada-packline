import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import FormControl from 'react-bootstrap/FormControl';
import FormCheck from 'react-bootstrap/FormCheck';
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

export default function ReprintLabels() {
    // State
    const [error, setError] = useState<string>('');
    const [isLotListLoaded, setIsLotListLoaded] = useState(false);
    const [supplierLotList, setSupplierLotList] = useState<ISupplierLot[]>([]);
    const [lotNumber, setLotNumber] = useState<string>('');
    const [preObjectList, setPreObjectList] = useState<IPreObject[]>([]);
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
                            adjust quantities. Then select and print labels.{' '}
                            {lotNumber}
                        </Card.Title>
                        <Form>
                            <Table
                                striped
                                bordered
                                hover
                                size="sm"
                                variant="dark"
                            >
                                <thead>
                                    <tr>
                                        <th className="text-center">
                                            <FormCheck type="checkbox" />
                                        </th>
                                        <th>Serial</th>
                                        <th>Lot</th>
                                        <th>Qty per Object</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {preObjectList.map((preObject) => (
                                        <tr key={preObject.serial}>
                                            <td className="text-center">
                                                <FormCheck type="checkbox" />
                                            </td>
                                            <td>{preObject.serial}</td>
                                            <td>{preObject.lotNumber}</td>
                                            <td>{preObject.quantity}</td>
                                            <td>Edit</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}
