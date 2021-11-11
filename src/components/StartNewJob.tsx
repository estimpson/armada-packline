import { Card, Form } from '../bootstrap';
import { IMachine } from '../features/machine/machineSlice';
import { IPackingJob } from '../features/packingJob/packingJobSlice';
import { IPart } from '../features/part/partSlice';
import { IPartPackaging } from '../features/partPackaging/partPackagingSlice';
import { DeflashDetails } from './DeflashDetails';
import { OpenJob } from './OpenJob';
import { SelectPart } from './SelectPart';
import { IListItem, ObjectSelect } from './shared/ObjectSelect';
import { SpecialInstructions } from './SpecialInstructions';
import { VerifyPieceWeight } from './VerifyPieceWeight';

export function StartNewJob(props: {
    packingJob: IPackingJob;
    part?: IPart;
    partSetter?: (part: IPart | undefined) => void;

    packaging?: IPartPackaging;
    packagingSetter?: (partPackaging: IPartPackaging | undefined) => void;

    acknowledged?: boolean;
    acknowledgementHandler?: (acknowledged: boolean) => void;

    quantity?: number;
    pieceWeight?: number;
    pieceWeightQuantityHandler?: (pieceWeight: number | undefined) => void;
    pieceWeightHandler?: (pieceWeight: number | undefined) => void;

    validPieceWeight?: boolean;
    operator?: string;
    machine?: IMachine;

    operatorHandler?: (operator: string) => void;
    machineHandler?: (machine: IMachine | undefined) => void;

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
                        <ObjectSelect
                            valueList={
                                (props.part &&
                                    props.part.packagingList &&
                                    props.part.packagingList.map(
                                        (partPackaging) => {
                                            return {
                                                displayValue:
                                                    partPackaging.packageCode,
                                                selectListValue: `${partPackaging.packageCode} - ${partPackaging.standardPack}`,
                                                value: partPackaging,
                                            };
                                        },
                                    )) ||
                                new Array<IListItem<IPartPackaging>>()
                            }
                            label="Select Packaging"
                            currentValue={props.packaging}
                            setter={props.packagingSetter}
                        />
                        {props.packaging &&
                            props.packaging.specialInstructions && (
                                <SpecialInstructions
                                    instructions={
                                        props.packaging.specialInstructions ||
                                        ''
                                    }
                                    acknowledged={props.acknowledged || false}
                                    acknowledgementHandler={
                                        props.acknowledgementHandler
                                    }
                                />
                            )}
                        {props.part &&
                            props.part.requiresFinalInspection &&
                            props.packaging &&
                            (!props.packaging.specialInstructions ||
                                props.acknowledged) && (
                                <VerifyPieceWeight
                                    packingJob={props.packingJob}
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
                            props.packaging &&
                            (!props.packaging.specialInstructions ||
                                props.acknowledged) &&
                            (props.validPieceWeight ||
                                props.packingJob.overridePieceWeight) && (
                                <DeflashDetails
                                    part={props.part}
                                    operator={props.operator}
                                    machine={props.machine}
                                    operatorHandler={props.operatorHandler}
                                    machineHandler={props.machineHandler}
                                />
                            )}
                        {props.part &&
                            props.packaging &&
                            (!props.part.requiresFinalInspection ||
                                ((props.acknowledged ||
                                    !props.packaging.specialInstructions) &&
                                    (props.validPieceWeight ||
                                        props.packingJob.overridePieceWeight) &&
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
