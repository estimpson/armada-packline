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

import SupplierPartList, { ISupplierPart } from '../data/SupplierPartList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import TableGrid from './grid/TableGrid';

// const supplierPartList = SupplisrPartList();

export default function GenerateInventory() {
    // State
    const [error, setError] = useState<string>('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [supplierPartList, setSupplierPartList] = useState<ISupplierPart[]>(
        [],
    );

    useEffect(() => {
        if (process.env['REACT_APP_API'] === 'Enabled') {
            axios
                .get<ISupplierPart[]>(
                    'https://www.fxsupplierportal.com/api/SupplierParts?supplierCode=ROC0010',
                )
                .then((response) => {
                    setSupplierPartList(response.data);
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
        setSupplierPartList(SupplierPartList());
        setIsLoaded(true);
    }, [isLoaded]);

    return (
        <>
            <Container>
                <h1 className="header">Generate Inventory</h1>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            Select a part and fill out the information below to
                            generate the object serial numbers for printing.
                        </Card.Title>
                        <Form>
                            <FormInputSelect
                                controlId="formSupplierParts"
                                label="Part:"
                                values={supplierPartList.map(
                                    (supplierPart) =>
                                        supplierPart.supplierPartCode,
                                )}
                            ></FormInputSelect>

                            <Form.Group
                                as={Row}
                                className="mb-3"
                                controlId="formFxPart"
                            >
                                <Form.Label column sm="6" md="4" lg="2">
                                    Part (Internal):
                                </Form.Label>
                                <Col sm="12" md="8" lg="4">
                                    <Form.Control readOnly />
                                </Col>
                            </Form.Group>

                            <Form.Group
                                as={Row}
                                className="mb-3"
                                controlId="formLotNumber"
                            >
                                <Form.Label column sm="6" md="4" lg="2">
                                    Lot Number:
                                </Form.Label>
                                <Col sm="12" md="8" lg="4">
                                    <Form.Control />
                                </Col>
                            </Form.Group>

                            <Form.Group
                                as={Row}
                                className="mb-3"
                                controlId="formNumberOfObjects"
                            >
                                <Form.Label column sm="6" md="4" lg="2">
                                    Number of Objects:
                                </Form.Label>
                                <Col sm="12" md="8" lg="4">
                                    <Form.Control type="number" />
                                </Col>
                            </Form.Group>

                            <Form.Group
                                as={Row}
                                className="mb-3"
                                controlId="formQuantityPerObject"
                            >
                                <Form.Label column sm="6" md="4" lg="2">
                                    Quantity per Object:
                                </Form.Label>
                                <Col sm="12" md="8" lg="4">
                                    <Form.Control />
                                </Col>
                            </Form.Group>

                            <Form.Group
                                as={Row}
                                className="mb-3"
                                controlId="formLabelFormat"
                            >
                                <Form.Label column sm="6" md="4" lg="2">
                                    Label Format:
                                </Form.Label>
                                <Col sm="12" md="8" lg="4">
                                    <Form.Control readOnly />
                                </Col>
                            </Form.Group>
                        </Form>
                        <Button>Generate Inventory</Button>
                    </Card.Body>
                </Card>
                <Card className="mt-5">
                    <Card.Body>
                        <Card.Title>
                            Edit the inventory in this batch to adjust
                            quantities. Then select and print labels.
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
                                    <tr>
                                        <td className="text-center">
                                            <FormCheck type="checkbox" />
                                        </td>
                                        <td>123</td>
                                        <td>XYZ</td>
                                        <td>100.0</td>
                                        <td>Edit</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">
                                            <FormCheck type="checkbox" />
                                        </td>
                                        <td>124</td>
                                        <td>
                                            <FormControl
                                                className="p-0"
                                                defaultValue="XYZ"
                                            />
                                        </td>
                                        <td>
                                            <FormControl
                                                className="p-0"
                                                defaultValue="100.0"
                                            />
                                        </td>
                                        <td>Update | Cancel</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">
                                            <FormCheck type="checkbox" />
                                        </td>
                                        <td>125</td>
                                        <td>XYZ</td>
                                        <td>100.0</td>
                                        <td>Edit</td>
                                    </tr>
                                </tbody>
                            </Table>
                            <TableGrid
                                select
                                editableRows
                                striped
                                columns={[
                                    {
                                        columnName: 'serial',
                                        columnHeader: 'Serial',
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
                                data={[]}
                            />
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}
