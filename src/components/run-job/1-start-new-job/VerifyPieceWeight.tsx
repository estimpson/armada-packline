import { useAppDispatch } from '../../../app/hooks';
import {
    Accordion,
    Button,
    Col,
    FloatingLabel,
    Form,
    Row,
} from '../../../bootstrap';
import {
    IPackingJob,
    overridePieceWeight,
    setPieceWeight,
    setPieceWeightDiscrepancyNote,
    setPieceWeightQuantity,
} from '../../../features/packingJob/packingJobSlice';

export function VerifyPieceWeight(props: { packingJob: IPackingJob }) {
    const dispatch = useAppDispatch();

    function pieceWeightQuantityHandler(
        pieceWeightQuantity: number | undefined,
    ): void {
        if (!props.packingJob.demoJob)
            dispatch(setPieceWeightQuantity(pieceWeightQuantity));
    }
    function pieceWeightHandler(pieceweight: number | undefined): void {
        if (!props.packingJob.demoJob) dispatch(setPieceWeight(pieceweight));
    }
    function pieceWeightDiscrepancyNoteHandler(note: string): void {
        if (!props.packingJob.demoJob)
            dispatch(setPieceWeightDiscrepancyNote(note));
    }
    function pieceWeightOverrideHandler(): void {
        if (!props.packingJob.demoJob) dispatch(overridePieceWeight());
    }

    const pieceWeightError =
        props.packingJob.part!.unitWeight &&
        props.packingJob.pieceWeight &&
        props.packingJob.part!.weightTolerance &&
        (props.packingJob.pieceWeight - props.packingJob.part!.unitWeight) /
            props.packingJob.part!.unitWeight;
    const valid =
        (pieceWeightError || pieceWeightError === 0) &&
        props.packingJob.part!.weightTolerance &&
        Math.abs(pieceWeightError) <= props.packingJob.part!.weightTolerance;

    return (
        <>
            <FloatingLabel
                controlId="floatingInput-pieceWeightQuantity"
                label="Piece Weight Quantity"
                className="mb-3"
            >
                <Form.Control
                    type="number"
                    value={props.packingJob.quantity || 0}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const target = event.target;
                        const value = target.value;
                        pieceWeightQuantityHandler(parseFloat(value));
                    }}
                    onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
                        const target = event.target;
                        target.select();
                    }}
                />
            </FloatingLabel>
            {props.packingJob.quantity && (
                <>
                    <FloatingLabel
                        controlId="floatingInput-pieceWeight"
                        label="Piece Weight Pounds"
                        className="mb-3"
                    >
                        <Form.Control
                            type="number"
                            value={props.packingJob.pieceWeight || 0}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                                const target = event.target;
                                const value = target.value;
                                pieceWeightHandler(parseFloat(value));
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
                                                props.packingJob.part!
                                                    .weightTolerance! * 100
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
