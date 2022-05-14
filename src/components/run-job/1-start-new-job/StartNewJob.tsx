import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Card, Form } from '../../../bootstrap';
import {
    IPackingJob,
    setPackaging,
    setPart,
} from '../../../features/packingJob/packingJobSlice';
import { IPart, selectPartList } from '../../../features/part/partSlice';
import { IPartPackaging } from '../../../features/partPackaging/partPackagingSlice';
import { DeflashDetails } from './DeflashDetails';
import { OpenJob } from './OpenJob';
import { IListItem, ObjectSelect } from '../../shared/ObjectSelect';
import { SpecialInstructions } from './SpecialInstructions';
import { VerifyPieceWeight } from './VerifyPieceWeight';
import { ObjectAutosuggest } from '../../shared/ObjectAutosuggest';

export function StartNewJob(props: { packingJob: IPackingJob }) {
    const dispatch = useAppDispatch();

    // dependent data sets
    const partList: IPart[] = useAppSelector(selectPartList);

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
                        <ObjectAutosuggest
                            valueList={
                                partList.map((part) => {
                                    return {
                                        displayValue: part.partCode,
                                        selectListValue: `${part.partCode} - ${
                                            part.partDescription
                                        } # ${part.unitWeight.toPrecision(
                                            3,
                                        )} +/- ${(
                                            part.unitWeight *
                                            part.weightTolerance
                                        ).toPrecision(3)}`,
                                        value: part,
                                    };
                                }) || new Array<IListItem<IPart>>()
                            }
                            label="Select Part"
                            currentValue={props.packingJob.part?.partCode}
                            setter={partHandler}
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
                            currentValue={
                                props.packingJob.packaging?.packageCode
                            }
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
                            (props.packingJob.acknowledged ||
                                !props.packingJob.packaging
                                    .specialInstructions) &&
                            (!props.packingJob.part.requiresFinalInspection ||
                                ((props.packingJob.validPieceWeight ||
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
