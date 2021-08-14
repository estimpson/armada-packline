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
import PreObjectList from '../data/PreObjectList';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

const preObjectList = PreObjectList('lot');

export default function ReprintLabels() {
    // State
    const [error, setError] = useState<string>('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [supplierLotList, setSupplierLotList] = useState<ISupplierLot[]>([]);

    useEffect(() => {
        if (process.env['REACT_APP_API'] === 'Enabled') {
            axios
                .get<ISupplierLot[]>(
                    'https://www.fxsupplierportal.com/api/SupplierLots?supplierCode=ROC0010',
                )
                .then((response) => {
                    setSupplierLotList(response.data);
                    setIsLoaded(true);
                })
                .catch((ex) => {
                    let error =
                        ex.code === 'ECONNABORTED'
                            ? 'A timeout has occurred'
                            : ex.response?.status === 404
                            ? 'Resource not found'
                            : 'An unexpected error has occurred';
                    setError(error);
                    setIsLoaded(false);
                });
            return;
        }
        setSupplierLotList(SupplierLotList());
        setIsLoaded(true);
    }, [isLoaded]);

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
                            ></FormInputSelect>
                        </Form>
                    </Card.Body>
                </Card>
                <Card className="mt-5">
                    <Card.Body>
                        <Card.Title>
                            (Optionally) Edit the inventory in this batch to
                            adjust quantities. Then select and print labels.
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
