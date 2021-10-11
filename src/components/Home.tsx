import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Button, Card, Col, Container, Form, Row } from '../bootstrap';
import {
    IIdentity,
    loginAsync,
    selectIdentity,
} from '../features/identity/identitySlice';
import { getPartList, IPart, selectPartList } from '../features/part/partSlice';
import {
    generateInventory,
    IPackingJob,
    selectPackingJob,
    setAcknowledged,
    setBoxes,
    setMachine,
    setOperator,
    setPart as setPackingJobPart,
    setPartialBoxQuantity,
    setPieceWeight,
    setPieceWeightQuantity,
    startJob,
    stopJob,
} from '../features/packingJob/packingJobSlice';
import { RunJob } from './RunJob';

export default function Home() {
    const dispatch = useAppDispatch();

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    // dependent data sets
    const partList: IPart[] = useAppSelector(selectPartList);
    const packingJob: IPackingJob = useAppSelector(selectPackingJob);

    useEffect(() => {
        dispatch(getPartList());
    }, [dispatch, partList]);

    // handlers for setting state in the store
    function setPart(part: IPart | undefined): void {
        dispatch(setPackingJobPart(part));
    }
    function acknowledgementHandler(acknowledged: boolean): void {
        dispatch(setAcknowledged(acknowledged));
    }
    function pieceWeightQuantityHandler(
        pieceWeightQuantity: number | undefined,
    ): void {
        dispatch(setPieceWeightQuantity(pieceWeightQuantity));
    }
    function pieceWeightHandler(pieceweight: number | undefined): void {
        dispatch(setPieceWeight(pieceweight));
    }
    function operatorHandler(operator: string): void {
        dispatch(setOperator(operator));
    }
    function machineHandler(machine: string): void {
        dispatch(setMachine(machine));
    }
    function startJobHandler(): void {
        dispatch(startJob());
    }
    function stopJobHandler(): void {
        dispatch(stopJob());
    }
    function boxesHandler(boxes: number): void {
        dispatch(setBoxes(boxes));
    }
    function partialBoxQuantityHandler(partialBoxQuantity: number): void {
        dispatch(setPartialBoxQuantity(partialBoxQuantity));
    }
    function generateInventoryHandler(): void {
        dispatch(generateInventory());
    }

    const identity: IIdentity = useAppSelector(selectIdentity);

    return (
        <>
            <Container className="col-md-8 col-lg-6">
                <Row>
                    <Col sm="8">
                        <p className="fs-1">Fx Pack Line</p>
                    </Col>
                </Row>
                {identity?.userName ? (
                    <>
                        <RunJob
                            packingJob={packingJob}
                            partChangeHandler={setPart}
                            acknowledgementHandler={acknowledgementHandler}
                            pieceWeightQuantityHandler={
                                pieceWeightQuantityHandler
                            }
                            pieceWeightHandler={pieceWeightHandler}
                            operatorHandler={operatorHandler}
                            machineHandler={machineHandler}
                            startJobHandler={startJobHandler}
                            stopJobHandler={stopJobHandler}
                            boxesHandler={boxesHandler}
                            partialBoxQuantityHandler={
                                partialBoxQuantityHandler
                            }
                            generateInventoryHandler={generateInventoryHandler}
                        />
                    </>
                ) : (
                    <>
                        <h1>Please login</h1>
                        <Card>
                            <Card.Body>
                                <Form>
                                    <Form.Group
                                        as={Row}
                                        className="mb-3"
                                        controlId="formUser"
                                    >
                                        <Form.Label column sm="6" md="4" lg="2">
                                            User:
                                        </Form.Label>
                                        <Col sm="12" md="8" lg="4">
                                            <Form.Control
                                                onChange={(e) =>
                                                    setUser(e.target.value)
                                                }
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group
                                        as={Row}
                                        className="mb-3"
                                        controlId="formPassword"
                                    >
                                        <Form.Label column sm="6" md="4" lg="2">
                                            Password:
                                        </Form.Label>
                                        <Col sm="12" md="8" lg="4">
                                            <Form.Control
                                                type="password"
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group>
                                        <Button
                                            onClick={() =>
                                                dispatch(
                                                    loginAsync({
                                                        user: user,
                                                        password: password,
                                                    }),
                                                )
                                            }
                                        >
                                            Submit
                                        </Button>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>
                    </>
                )}
            </Container>
        </>
    );
}
