import { IMachine } from '../features/machine/machineSlice';
import { IPackingJob } from '../features/packingJob/packingJobSlice';
import { IPart } from '../features/part/partSlice';
import { IPartPackaging } from '../features/partPackaging/partPackagingSlice';
import { BeginJobSummary } from './BeginJobSummary';
import { CompleteJob } from './CompleteJob';
import { JobInventory } from './JobInventory';
import { LotQuantity } from './LotQuantity';
import { LotQuantitySummary } from './LotQuantitySummary';
import { StartNewJob } from './StartNewJob';

export function RunJob(props: { step?: string; packingJob: IPackingJob }) {
    return (
        <>
            {props.step && <p className="fs-5">{props.step}</p>}
            {!props.packingJob.jobInProgress ? (
                <StartNewJob packingJob={props.packingJob} />
            ) : (
                <BeginJobSummary packingJob={props.packingJob} />
            )}
            {props.packingJob.packaging &&
                props.packingJob.jobInProgress &&
                (!props.packingJob.objectList?.length ? (
                    <LotQuantity packingJob={props.packingJob} />
                ) : (
                    <>
                        <LotQuantitySummary packingJob={props.packingJob} />
                        <JobInventory packingJob={props.packingJob} />
                        {props.packingJob.objectList.filter(
                            (object) => !object.printed,
                        ).length ? (
                            <></>
                        ) : (
                            <CompleteJob packingJob={props.packingJob} />
                        )}
                    </>
                ))}
        </>
    );
}
