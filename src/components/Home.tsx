import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    Button,
    Card,
    Col,
    Container,
    Form,
    Row,
    FloatingLabel,
} from '../bootstrap';
import {
    IIdentity,
    loginAsync,
    selectIdentity,
} from '../features/identity/identitySlice';
import { getPartList, IPart, selectPartList } from '../features/part/partSlice';
import {
    combinePartialBox,
    completeJob,
    deleteBox,
    generateInventory,
    IPackingJob,
    printLabels,
    resetInventory,
    selectPackingJob,
    setAcknowledged,
    setBoxes,
    setMachine,
    setOperator,
    setPackaging,
    setPart as setPackingJobPart,
    setPartialBoxQuantity,
    setPieceWeight,
    setPieceWeightQuantity,
    startJob,
    stopJob,
} from '../features/packingJob/packingJobSlice';
import { RunJob } from './RunJob';
import { IMachine } from '../features/machine/machineSlice';
import { IPartPackaging } from '../features/partPackaging/partPackagingSlice';

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
    function packagingSetter(partPackaging: IPartPackaging | undefined): void {
        dispatch(setPackaging(partPackaging));
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
    function machineHandler(machine: IMachine | undefined): void {
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
    function resetInventoryHandler(): void {
        dispatch(resetInventory());
    }
    function deleteBoxHandler(serial: number): void {
        dispatch(deleteBox(serial));
    }
    function printLabelsHandler(): void {
        dispatch(printLabels());
    }
    function combinePartialBoxHandler(scanData: string): void {
        dispatch(combinePartialBox(scanData));
    }
    function completeJobHandler(): void {
        dispatch(completeJob());
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
                            packagingSetter={packagingSetter}
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
                            resetInventoryHandler={resetInventoryHandler}
                            deleteBoxHandler={deleteBoxHandler}
                            printLabelsHandler={printLabelsHandler}
                            combinePartialBoxHandler={combinePartialBoxHandler}
                            completeJobHandler={completeJobHandler}
                        />
                    </>
                ) : (
                    <>
                        <h1>Please login</h1>
                        <Card>
                            <Card.Body>
                                <Form>
                                    <FloatingLabel
                                        controlId="floatingInput-user"
                                        label="User"
                                        className="mb-3"
                                    >
                                        <Form.Control
                                            placeholder="user"
                                            onChange={(e) =>
                                                setUser(e.target.value)
                                            }
                                        />
                                    </FloatingLabel>
                                    <FloatingLabel
                                        controlId="floatingInput-password"
                                        label="Password"
                                        className="mb-3"
                                    >
                                        <Form.Control
                                            type="password"
                                            placeholder="password"
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                        />
                                    </FloatingLabel>
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
