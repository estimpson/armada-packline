import React, { useState } from 'react';
import { Button, Card, FloatingLabel, Form } from '../bootstrap';
import { IPackingObject } from '../features/packingJob/packingJobSlice';
import { IPart } from '../features/part/partSlice';

export function InventoryBox(props: {
    part: IPart;
    object: IPackingObject;
    deleteBoxHandler?: (serial: number) => void;
    combinePartialBoxHandler?: (scanData: string) => void;
}) {
    const [scanData, setScanData] = useState<string>('');

    return (
        <Card>
            <Card.Body>
                <Card.Title>{`S${props.object.serial}${
                    props.object.partial ? ' [Partial]' : ''
                }${props.object.printed ? ' -- Printed' : ''}`}</Card.Title>
                <Form>
                    <FloatingLabel
                        controlId="floatingInput-part"
                        label="Part"
                        className="mb-3"
                    >
                        <Form.Control readOnly value={props.part.partCode} />
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Quantity"
                        className="mb-3"
                    >
                        <Form.Control readOnly value={props.object.quantity} />
                    </FloatingLabel>
                    {props.object.partial && (
                        <FloatingLabel
                            controlId="floatingInput-combinescan"
                            label="Scan partial S3521477 (qty 35) to combine"
                            className="mb-3"
                        >
                            <Form.Control
                                autoComplete={'off'}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    setScanData(event.target.value);
                                }}
                                onKeyUp={(
                                    event: React.KeyboardEvent<HTMLInputElement>,
                                ) => {
                                    if (event.key === 'Enter') {
                                        props.combinePartialBoxHandler &&
                                            props.combinePartialBoxHandler(
                                                scanData,
                                            );
                                        setScanData('');
                                    }
                                }}
                                value={scanData}
                            />
                        </FloatingLabel>
                    )}
                </Form>
                <Button
                    onClick={() => {
                        props.deleteBoxHandler &&
                            props.deleteBoxHandler(props.object.serial);
                    }}
                >
                    Delete Box
                </Button>
            </Card.Body>
        </Card>
    );
}
