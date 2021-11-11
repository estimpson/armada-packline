import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Accordion, Button, Col, FloatingLabel, Form, Row } from '../bootstrap';
import {
    IPackingJob,
    overridePieceWeight,
    selectPackingJob,
    setPieceWeightDiscrepancyNote,
} from '../features/packingJob/packingJobSlice';

export function VerifyPieceWeight(props: {
    packingJob: IPackingJob;
    standardPieceWeight?: number;
    weightTolerance?: number;
    quantity?: number;
    pieceWeight?: number;

    pieceWeightQuantityHandler?: (pieceWeight: number | undefined) => void;
    pieceWeightHandler?: (pieceWeight: number | undefined) => void;
}) {
    const dispatch = useAppDispatch();

    const pieceWeightError =
        props.standardPieceWeight &&
        props.pieceWeight &&
        props.weightTolerance &&
        (props.pieceWeight - props.standardPieceWeight) /
            props.standardPieceWeight;
    const valid =
        (pieceWeightError || pieceWeightError === 0) &&
        props.weightTolerance &&
        Math.abs(pieceWeightError) <= props.weightTolerance;

    function pieceWeightDiscrepancyNoteHandler(note: string): void {
        dispatch(setPieceWeightDiscrepancyNote(note));
    }
    function pieceWeightOverrideHandler(): void {
        dispatch(overridePieceWeight());
    }

    return (
        <>
            <FloatingLabel
                controlId="floatingInput-pieceWeightQuantity"
                label="Piece Weight Quantity"
                className="mb-3"
            >
                <Form.Control
                    type="number"
                    value={props.quantity || 0}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const target = event.target;
                        const value = target.value;
                        if (props.pieceWeightQuantityHandler) {
                            props.pieceWeightQuantityHandler(parseFloat(value));
                        }
                    }}
                    onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
                        const target = event.target;
                        target.select();
                    }}
                />
            </FloatingLabel>
            {props.quantity && (
                <>
                    <FloatingLabel
                        controlId="floatingInput-pieceWeight"
                        label="Piece Weight Pounds"
                        className="mb-3"
                    >
                        <Form.Control
                            type="number"
                            value={props.pieceWeight || 0}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                                const target = event.target;
                                const value = target.value;
                                if (props.pieceWeightHandler) {
                                    props.pieceWeightHandler(parseFloat(value));
                                }
                            }}
                            onFocus={(
                                event: React.FocusEvent<HTMLInputElement>,
                            ) => {
                                const target = event.target;
                                target.select();
                            }}
                        />
                    </FloatingLabel>
                    {pieceWeightError || pieceWeightError === 0 ? (
                        valid ? (
                            <Form.Group as={Row} className="mb-3">
                                <Col sm="3"></Col>
                                <Col sm="9">
                                    <p>
                                        Piece weight appears valid [
                                        {pieceWeightError < 0 ? '-' : '+'}{' '}
                                        {Math.abs(
                                            pieceWeightError * 100,
                                        ).toFixed(2)}
                                        %]
                                    </p>
                                </Col>
                            </Form.Group>
                        ) : (
                            <>
                                <Form.Group
                                    as={Row}
                                    className="mb-3 text-white bg-danger"
                                >
                                    <Col sm="3"></Col>
                                    <Col sm="9">
                                        <p>
                                            Piece weight exceeds tolerance [+/-
                                            {(
                                                props.weightTolerance! * 100
                                            ).toFixed(2)}
                                            %]
                                        </p>
                                        {props.packingJob
                                            .overridePieceWeight && (
                                            <p>
                                                Discrepancy reason:{' '}
                                                {
                                                    props.packingJob
                                                        .pieceWeightDiscrepancyNote
                                                }
                                            </p>
                                        )}
                                    </Col>
                                </Form.Group>
                                {!props.packingJob.overridePieceWeight && (
                                    <>
                                        <Accordion>
                                            <Accordion.Item eventKey="0">
                                                <Accordion.Header>
                                                    View recent weight
                                                    measurements
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    <ol>
                                                        <li>1.23</li>
                                                        <li>.123</li>
                                                        <li>12.3</li>
                                                        <li>123</li>
                                                    </ol>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                        <Accordion>
                                            <Accordion.Item eventKey="0">
                                                <Accordion.Header>
                                                    Accept measurement with
                                                    notes
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    <Form.Group
                                                        as={Row}
                                                        className="mb-3 text-white bg-warning"
                                                    >
                                                        <Form.Label
                                                            column
                                                            sm="3"
                                                        >
                                                            Discrepancy Note
                                                        </Form.Label>
                                                        <Col sm="9">
                                                            <Form.Control
                                                                as="textarea"
                                                                rows={3}
                                                                value={
                                                                    props
                                                                        .packingJob
                                                                        .pieceWeightDiscrepancyNote
                                                                }
                                                                className="text-dark my-2"
                                                                onChange={(
                                                                    event: React.ChangeEvent<HTMLInputElement>,
                                                                ) => {
                                                                    const target =
                                                                        event.target;
                                                                    const value =
                                                                        target.value;
                                                                    pieceWeightDiscrepancyNoteHandler(
                                                                        value,
                                                                    );
                                                                }}
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                    <Button
                                                        onClick={() => {
                                                            pieceWeightOverrideHandler();
                                                        }}
                                                    >
                                                        Store Note and Continue
                                                    </Button>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                    </>
                                )}
                            </>
                        )
                    ) : (
                        <></>
                    )}
                </>
            )}
        </>
    );
}
