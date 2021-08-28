import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Toast from 'react-bootstrap/Toast';
import FormInputSelect from './forms/FormInputSelect';

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

import SupplierPartList, { ISupplierPart } from '../data/SupplierPartList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import TableGrid from './grid/TableGrid';
import { IPreObject } from '../data/PreObjectList';
import { IIdentity, selectIdentity } from '../features/identity/identitySlice';
import { useAppSelector } from '../app/hooks';
import { IPrinter, printLabels } from '../data/services/LocalPrinter';
import { saveLotQuantityChange } from '../data/services/PreObjects';

function generateBatch(
    supplierCode: string,
    supplierPartCode: string,
    internalPartCode: string,
    lotNumber: string,
    quantityPerObject: number,
    numberOfObjects: number,
    setResult: (results: Array<IPreObject>) => void,
    setError: (error: string) => void,
) {
    if (process.env['REACT_APP_API'] === 'Enabled') {
        let queryString = `https://www.fxsupplierportal.com/api/PreObjects/Batch?supplierCode=${encodeURIComponent(
            supplierCode,
        )}&supplierPartCode=${encodeURIComponent(
            supplierPartCode,
        )}&internalPartCode=${encodeURIComponent(
            internalPartCode,
        )}&lotNumber=${encodeURIComponent(
            lotNumber,
        )}&qtyPerObject=${encodeURIComponent(
            quantityPerObject,
        )}&objectCount=${encodeURIComponent(numberOfObjects)}`;
        console.log(queryString);
        axios
            .post<IPreObject[]>(queryString)
            .then((response) => {
                setResult(response.data);
            })
            .catch((ex) => {
                let error =
                    ex.code === 'ECONNABORTED'
                        ? 'A timeout has occurred'
                        : ex.response?.status === 404
                        ? 'Resource not found'
                        : 'An unexpected error has occurred';
                console.log(error);
                setError(error);
                return;
            });
    }
}

export default function GenerateInventory() {
    // State
    const [error, setError] = useState<string>('');
    const [isPartListLoaded, setIsPartListLoaded] = useState(false);
    const [supplierPartList, setSupplierPartList] = useState<ISupplierPart[]>(
        [],
    );
    const [supplierPart, setSupplierPart] = useState<ISupplierPart | undefined>(
        undefined,
    );
    const [lotNumber, setLotNumber] = useState<string | undefined>(undefined);
    const [numberOfObjects, setNumberOfObjects] = useState<number | undefined>(
        undefined,
    );
    const [quantityPerObject, setQuantityPerObject] = useState<
        number | undefined
    >(undefined);
    const [preObjectList, setPreObjectList] = useState<IPreObject[]>([]);
    const [selectedPreObjectList, setSelectedPreObjectList] = useState<
        IPreObject[]
    >([]);
    const [currentPrinter, setCurrentPrinter] = useState<IPrinter | undefined>(
        undefined,
    );
    const [isCurrentPrinterLoaded, setIsCurrentPrinterLoaded] = useState(false);

    const identity: IIdentity = useAppSelector(selectIdentity);

    useEffect(() => {
        if (process.env['REACT_APP_API'] === 'Enabled') {
            axios
                .get<ISupplierPart[]>(
                    `https://www.fxsupplierportal.com/api/SupplierParts?supplierCode=${identity.supplierCode}`,
                )
                .then((response) => {
                    setSupplierPartList(response.data);
                    setIsPartListLoaded(true);
                })
                .catch((ex) => {
                    let error =
                        ex.code === 'ECONNABORTED'
                            ? 'A timeout has occurred'
                            : ex.response?.status === 404
                            ? 'Resource not found'
                            : 'An unexpected error has occurred';
                    setError(error);
                    setIsPartListLoaded(false);
                });
            return;
        }
        setSupplierPartList(SupplierPartList());
        setIsPartListLoaded(true);
    }, [identity.supplierCode, isPartListLoaded]);

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

    const partSelectionHandler = (e: string | null) => {
        setSupplierPart(
            supplierPartList.find(
                (supplierPart) => supplierPart?.supplierPartCode === e,
            ),
        );
        setLotNumber(undefined);
        setNumberOfObjects(undefined);
        setQuantityPerObject(supplierPart?.supplierStdPack);
    };

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
                                selectionHandler={partSelectionHandler}
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
                                    <Form.Control
                                        readOnly
                                        value={supplierPart?.internalPartCode}
                                    />
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
                                    <Form.Control
                                        value={lotNumber || ''}
                                        onChange={(event) => {
                                            setLotNumber(event.target.value);
                                        }}
                                    />
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
                                    <Form.Control
                                        type="number"
                                        value={numberOfObjects || ''}
                                        onChange={(event) => {
                                            setNumberOfObjects(
                                                parseInt(event.target.value),
                                            );
                                        }}
                                    />
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
                                    <Form.Control
                                        type="number"
                                        value={quantityPerObject || ''}
                                        onChange={(event) => {
                                            setQuantityPerObject(
                                                parseInt(event.target.value),
                                            );
                                        }}
                                    />
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
                                    <Form.Control
                                        readOnly
                                        value={supplierPart?.labelFormatName}
                                    />
                                </Col>
                            </Form.Group>
                        </Form>
                        <Button
                            disabled={
                                !identity.supplierCode ||
                                !supplierPart ||
                                !lotNumber ||
                                !numberOfObjects ||
                                !quantityPerObject
                            }
                            onClick={() => {
                                generateBatch(
                                    identity.supplierCode!,
                                    supplierPart!.supplierPartCode!,
                                    supplierPart!.internalPartCode!,
                                    lotNumber!,
                                    quantityPerObject!,
                                    numberOfObjects!,
                                    setPreObjectList,
                                    setError,
                                );
                            }}
                        >
                            Generate Inventory
                        </Button>
                    </Card.Body>
                </Card>
                {preObjectList.length ? (
                    <Card className="mt-5">
                        <Card.Body>
                            <Card.Title>
                                Edit the inventory in this batch to adjust
                                quantities. Then select and print labels.
                            </Card.Title>
                            <Button
                                onClick={() => {
                                    let supplierCode =
                                        identity.supplierCode || '';
                                    console.log(supplierCode);
                                    let serialList = selectedPreObjectList
                                        .map((po) => po.serial)
                                        .join();
                                    console.log(serialList);
                                    let printerDriver =
                                        currentPrinter?.printerDriver || '';
                                    console.log(printerDriver);
                                    printLabels(
                                        supplierCode,
                                        serialList,
                                        printerDriver,
                                    );
                                }}
                            >
                                Print {selectedPreObjectList.length} select
                                labels
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
                                            columnName: 'supplierPartCode',
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
                                            columnName: 'labelFormatName',
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
                                        setSelectedPreObjectList(selectedRows);
                                    }}
                                />
                            </Form>
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
