import { Col, FloatingLabel, Form, Row } from '../bootstrap';

export function VerifyPieceWeight(props: {
    standardPieceWeight?: number;
    weightTolerance?: number;
    quantity?: number;
    pieceWeight?: number;
    pieceWeightQuantityHandler?: (pieceWeight: number | undefined) => void;
    pieceWeightHandler?: (pieceWeight: number | undefined) => void;
}) {
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
    return (
        <>
            <Form.Group as={Row} className="mb-3">
                <FloatingLabel
                    controlId="floatingInput-pieceWeightQuantity"
                    label="Piece Weight Quantity"
                    className="mb-3"
                >
                    <Form.Control
                        type="number"
                        value={props.quantity || 0}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                            const target = event.target;
                            const value = target.value;
                            if (props.pieceWeightQuantityHandler) {
                                props.pieceWeightQuantityHandler(
                                    parseFloat(value),
                                );
                            }
                        }}
                    />
                </FloatingLabel>
            </Form.Group>
            {props.quantity && (
                <>
                    <Form.Group as={Row} className="mb-1">
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
                                        props.pieceWeightHandler(
                                            parseFloat(value),
                                        );
                                    }
                                }}
                            />
                        </FloatingLabel>
                    </Form.Group>
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
                                    </Col>
                                </Form.Group>
                                <p className="fst-italics text-white bg-warning px-2">
                                    What do we want to do at this point if the
                                    piece weight is out of tolerance? Should we
                                    add a "notify quality inspector" button and
                                    let them proceed to label or not?
                                </p>
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
