import { IPackingJob } from '../../features/packingJob/packingJobSlice';
import { BeginJobSummary } from './2-begin-job-summary/BeginJobSummary';
import { CompleteJob } from './6-complete-job/CompleteJob';
import { JobInventory } from './5-job-inventory/JobInventory';
import { LotQuantity } from './3-lot-quantity/LotQuantity';
import { LotQuantitySummary } from './4-lot-quantity-summary/LotQuantitySummary';
import { StartNewJob } from './1-start-new-job/StartNewJob';

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
