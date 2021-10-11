import { Card, Form } from '../bootstrap';
import { IPart } from '../features/part/partSlice';
import { DeflashDetails } from './DeflashDetails';
import { OpenJob } from './OpenJob';
import { SelectPart } from './SelectPart';
import { SpecialInstructions } from './SpecialInstructions';
import { VerifyPieceWeight } from './VerifyPieceWeight';

export function StartNewJob(props: {
    part?: IPart;
    partSetter?: (part: IPart | undefined) => void;

    acknowledged?: boolean;
    acknowledgementHandler?: (acknowledged: boolean) => void;

    quantity?: number;
    pieceWeight?: number;
    pieceWeightQuantityHandler?: (pieceWeight: number | undefined) => void;
    pieceWeightHandler?: (pieceWeight: number | undefined) => void;

    validPieceWeight?: boolean;
    operator?: string;
    machine?: string;

    operatorHandler?: (operator: string) => void;
    machineHandler?: (machine: string) => void;

    jobInProgress?: boolean;
    startJobHandler?: () => void;
}) {
    return (
        <>
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>Begin New Job</Card.Title>
                    <Form>
                        <SelectPart
                            part={props.part}
                            partSetter={props.partSetter}
                        />
                        {props.part && props.part.specialInstructions && (
                            <SpecialInstructions
                                instructions={
                                    props.part.specialInstructions || ''
                                }
                                acknowledged={props.acknowledged || false}
                                acknowledgementHandler={
                                    props.acknowledgementHandler
                                }
                            />
                        )}
                        {props.part &&
                            props.part.requiresFinalInspection &&
                            (!props.part.specialInstructions ||
                                props.acknowledged) && (
                                <VerifyPieceWeight
                                    standardPieceWeight={props.part.unitWeight}
                                    weightTolerance={props.part.weightTolerance}
                                    quantity={props.quantity}
                                    pieceWeight={props.pieceWeight}
                                    pieceWeightQuantityHandler={
                                        props.pieceWeightQuantityHandler
                                    }
                                    pieceWeightHandler={
                                        props.pieceWeightHandler
                                    }
                                />
                            )}
                        {props.part &&
                            props.part.requiresFinalInspection &&
                            (!props.part.specialInstructions ||
                                props.acknowledged) &&
                            props.validPieceWeight && (
                                <DeflashDetails
                                    part={props.part}
                                    operator={props.operator}
                                    machine={props.machine}
                                    operatorHandler={props.operatorHandler}
                                    machineHandler={props.machineHandler}
                                />
                            )}
                        {props.part &&
                            (!props.part.requiresFinalInspection ||
                                ((props.acknowledged ||
                                    !props.part.specialInstructions) &&
                                    props.validPieceWeight &&
                                    props.operator &&
                                    props.machine)) && (
                                <OpenJob
                                    startJobHandler={props.startJobHandler}
                                />
                            )}
                    </Form>
                </Card.Body>
            </Card>
        </>
    );
}
