import {
    combinePreObjectAsync,
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
import { getRecentPieceWeightListAsync } from '../../features/recentPieceWeight/recentPieceWeightSlice';
import { selectScannerData } from '../../features/barcodeScanner/barcodeScannerSlice';

export function RunJob(props: { step?: string; packingJob: IPackingJob }) {
    const dispatch = useAppDispatch();

    // dependent state
    const apiDetails = useAppSelector(selectApiDetails);
    const scannerData = useAppSelector(selectScannerData);

    useEffect(() => {
        const load = async () => {
            if (apiDetails.port) {
                if (props.packingJob.part) {
                    dispatch(
                        getPartialBoxListAsync(props.packingJob.part!.partCode),
                    );
                    dispatch(
                        getRecentPieceWeightListAsync(
                            props.packingJob.part?.partCode,
                        ),
                    );
                }
                // is either a fulfilled or rejected action
                const machineListAction = await dispatch(getMachineListAsync());
                const partListAction = await dispatch(getPartListAsync());
                if (
                    isFulfilled(machineListAction) &&
                    isFulfilled(partListAction) &&
                    !!props.packingJob.packingJobNumber
                ) {
                    dispatch(getPackingJobAsync());
                }
            }
        };
        load();
    }, [dispatch, apiDetails]);

    useEffect(() => {
        const combine = async () => {
            if (
                apiDetails.port &&
                !!props.packingJob.packingJobNumber &&
                !!props.packingJob.objectList &&
                !!props.packingJob.partialBoxQuantity &&
                !!scannerData &&
                !!scannerData.scanData
            ) {
                const combineAction = await dispatch(
                    combinePreObjectAsync(scannerData),
                );
                if (isFulfilled(combineAction) && props.packingJob.part) {
                    dispatch(
                        getPartialBoxListAsync(props.packingJob.part!.partCode),
                    );
                }
            }
        };
        combine();
    }, [dispatch, scannerData]);

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
            {!!props.packingJob.objectList?.length && (
                <JobInventory packingJob={props.packingJob} />
            )}
            {!!props.packingJob.objectList?.length &&
                (props.packingJob.objectList.filter((object) => !object.printed)
                    .length ? (
                    <></>
                ) : (
                    <CompleteJob packingJob={props.packingJob} />
                ))}
        </>
    );
}
