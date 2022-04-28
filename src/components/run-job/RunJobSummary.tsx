import { IPackingJob } from '../../features/packingJob/packingJobSlice';
import { BeginJobSummary } from './2-begin-job-summary/BeginJobSummary';
import { LotQuantitySummary } from './4-lot-quantity-summary/LotQuantitySummary';

export function RunJobSummary(props: {
    step?: string;
    packingJob: IPackingJob;
}) {
    return (
        <>
            {' '}
            {props.step && <p className="fs-5">{props.step}</p>}
            {!props.packingJob.jobInProgress ? (
                <></>
            ) : (
                <BeginJobSummary packingJob={props.packingJob} />
            )}
            {props.packingJob.packaging &&
                props.packingJob.jobInProgress &&
                (!props.packingJob.objectList?.length ? (
                    <></>
                ) : (
                    <>
                        <LotQuantitySummary packingJob={props.packingJob} />
                    </>
                ))}
        </>
    );
}
