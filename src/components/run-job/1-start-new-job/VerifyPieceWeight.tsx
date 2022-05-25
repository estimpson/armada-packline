import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
    Accordion,
    Button,
    Col,
    FloatingLabel,
    Form,
    Row,
} from '../../../bootstrap';
import {
    applicationNoticeOccurred,
    ApplicationNoticeType,
} from '../../../features/applicationNotice/applicationNoticeSlice';
import {
    IPackingJob,
    overridePieceWeight,
    setPieceWeight,
    setPieceWeightDiscrepancyNote,
    setPieceWeightQuantity,
} from '../../../features/packingJob/packingJobSlice';
import { selectRecentPieceWeightList } from '../../../features/recentPieceWeight/recentPieceWeightSlice';

export function VerifyPieceWeight(props: { packingJob: IPackingJob }) {
    const [enteredPieceWeight, setEnteredPieceWeight] = useState<string>(
        props.packingJob.pieceWeight?.toString() || '',
    );
    const recentPieceWeightList = useAppSelector(selectRecentPieceWeightList);
    const dispatch = useAppDispatch();

    function pieceWeightQuantityHandler(
        pieceWeightQuantity: number | undefined,
    ): void {
        if (!props.packingJob.demoJob)
            dispatch(setPieceWeightQuantity(pieceWeightQuantity));
    }
    function pieceWeightDiscrepancyNoteHandler(note: string): void {
        if (!props.packingJob.demoJob)
            dispatch(setPieceWeightDiscrepancyNote(note));
    }
    function pieceWeightOverrideHandler(): void {
        if (!props.packingJob.demoJob) dispatch(overridePieceWeight());
    }

    function validatePieceWeight() {
        let enteredText = enteredPieceWeight;
        if (!enteredText) {
            dispatch(setPieceWeight(undefined));
            return;
        }
        if (enteredText?.startsWith('.')) {
            enteredText = '0' + enteredText;
        }
        let enteredValue = parseFloat(enteredText!);

        if (enteredValue <= 0) {
            dispatch(
                applicationNoticeOccurred({
                    type: ApplicationNoticeType.Warning,
                    message: 'Piece weight must be greater than zero',
                }),
            );
        }
        dispatch(setPieceWeight(enteredValue));
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
                            type="text"
                            value={enteredPieceWeight}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                                const target = event.target;
                                const value = target.value;
                                setEnteredPieceWeight(value);
                                dispatch(setPieceWeight(undefined));
                            }}
                            onBlur={() => validatePieceWeight()}
                            onKeyPress={(
                                event: React.KeyboardEvent<HTMLInputElement>,
                            ) => {
                                if (event.key === 'Enter') {
                                    validatePieceWeight();
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
                                                        {recentPieceWeightList?.map(
                                                            (
                                                                recentPieceWeight,
                                                            ) => {
                                                                return (
                                                                    <li
                                                                        key={
                                                                            recentPieceWeight.rowID
                                                                        }
                                                                    >
                                                                        {
                                                                            recentPieceWeight.pieceWeight
                                                                        }
                                                                    </li>
                                                                );
                                                            },
                                                        )}
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
