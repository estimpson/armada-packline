import { useAppDispatch } from '../app/hooks';
import { Card, Form } from '../bootstrap';
import { IMachine } from '../features/machine/machineSlice';
import {
    IPackingJob,
    setPackaging,
    setPart,
} from '../features/packingJob/packingJobSlice';
import { IPart } from '../features/part/partSlice';
import { IPartPackaging } from '../features/partPackaging/partPackagingSlice';
import { DeflashDetails } from './DeflashDetails';
import { OpenJob } from './OpenJob';
import { SelectPart } from './SelectPart';
import { IListItem, ObjectSelect } from './shared/ObjectSelect';
import { SpecialInstructions } from './SpecialInstructions';
import { VerifyPieceWeight } from './VerifyPieceWeight';

export function StartNewJob(props: { packingJob: IPackingJob }) {
    const dispatch = useAppDispatch();

    function partHandler(part: IPart | undefined): void {
        if (!props.packingJob.demoJob) dispatch(setPart(part));
    }
    function packagingHandler(packaging: IPartPackaging | undefined): void {
        if (!props.packingJob.demoJob) dispatch(setPackaging(packaging));
    }

    return (
        <>
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>Begin New Job</Card.Title>
                    <Form>
                        <SelectPart
                            part={props.packingJob.part}
                            partSetter={partHandler}
                        />
                        <ObjectSelect
                            valueList={
                                (props.packingJob.part &&
                                    props.packingJob.part.packagingList &&
                                    props.packingJob.part.packagingList.map(
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
                            currentValue={props.packingJob.packaging}
                            setter={packagingHandler}
                        />
                        {props.packingJob.packaging &&
                            props.packingJob.packaging.specialInstructions && (
                                <SpecialInstructions
                                    packingJob={props.packingJob}
                                />
                            )}
                        {props.packingJob.part &&
                            props.packingJob.part.requiresFinalInspection &&
                            props.packingJob.packaging &&
                            (!props.packingJob.packaging.specialInstructions ||
                                props.packingJob.acknowledged) && (
                                <VerifyPieceWeight
                                    packingJob={props.packingJob}
                                />
                            )}
                        {props.packingJob.part &&
                            props.packingJob.part.requiresFinalInspection &&
                            props.packingJob.packaging &&
                            (!props.packingJob.packaging.specialInstructions ||
                                props.packingJob.acknowledged) &&
                            (props.packingJob.validPieceWeight ||
                                props.packingJob.overridePieceWeight) && (
                                <DeflashDetails packingJob={props.packingJob} />
                            )}
                        {props.packingJob.part &&
                            props.packingJob.packaging &&
                            (!props.packingJob.part.requiresFinalInspection ||
                                ((props.packingJob.acknowledged ||
                                    !props.packingJob.packaging
                                        .specialInstructions) &&
                                    (props.packingJob.validPieceWeight ||
                                        props.packingJob.overridePieceWeight) &&
                                    props.packingJob.operator &&
                                    props.packingJob.machine)) && (
                                <OpenJob packingJob={props.packingJob} />
                            )}
                    </Form>
                </Card.Body>
            </Card>
        </>
    );
}
