import {
    getPackingJobAsync,
    IPackingJob,
} from '../../features/packingJob/packingJobSlice';
import { CompleteJob } from './6-complete-job/CompleteJob';
import { JobInventory } from './5-job-inventory/JobInventory';
import { LotQuantity } from './3-lot-quantity/LotQuantity';
import { StartNewJob } from './1-start-new-job/StartNewJob';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useEffect } from 'react';
import { getPartListAsync } from '../../features/part/partSlice';
import { getMachineListAsync } from '../../features/machine/machineSlice';
import { isFulfilled } from '@reduxjs/toolkit';
import { selectApiDetails } from '../../features/localApi/localApiSlice';
import { getPartialBoxListAsync } from '../../features/partialBox/partialBoxListSlice';

export function RunJob(props: { step?: string; packingJob: IPackingJob }) {
    const apiDetails = useAppSelector(selectApiDetails);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const load = async () => {
            if (apiDetails.port) {
                if (props.packingJob.part) {
                    dispatch(
                        getPartialBoxListAsync(props.packingJob.part?.partCode),
                    );
                }
                // is either a fulfilled or rejected action
                const machineListAction = await dispatch(getMachineListAsync());
                const partListAction = await dispatch(getPartListAsync());
                if (
                    isFulfilled(machineListAction) &&
                    isFulfilled(partListAction)
                ) {
                    dispatch(getPackingJobAsync());
                }
            }
        };
        load();
    }, [dispatch, apiDetails]);

    return (
        <>
            {props.step && <p className="fs-5">{props.step}</p>}
            {!props.packingJob.jobInProgress && (
                <StartNewJob packingJob={props.packingJob} />
            )}
            {props.packingJob.packaging &&
                props.packingJob.jobInProgress &&
                !props.packingJob.objectList?.length && (
                    <LotQuantity packingJob={props.packingJob} />
                )}
            {props.packingJob.objectList?.length && (
                <JobInventory packingJob={props.packingJob} />
            )}
            {props.packingJob.objectList?.length &&
                (props.packingJob.objectList.filter((object) => !object.printed)
                    .length ? (
                    <></>
                ) : (
                    <CompleteJob packingJob={props.packingJob} />
                ))}
        </>
    );
}
