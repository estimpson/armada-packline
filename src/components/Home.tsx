import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Col, Container, Row } from '../bootstrap';
import { IIdentity, selectIdentity } from '../features/identity/identitySlice';
import {
    getPackingJobAsync,
    IPackingJob,
    selectPackingJob,
} from '../features/packingJob/packingJobSlice';
import { RunJob } from './run-job/RunJob';
import Split from 'react-split';
import { RunJobSummary } from './run-job/RunJobSummary';
import Login from './Login';
import { useEffect } from 'react';
import { selectApiDetails } from '../features/localApi/localApiSlice';
import { getPartialBoxListAsync } from '../features/partialBox/partialBoxListSlice';
import { getRecentPieceWeightListAsync } from '../features/recentPieceWeight/recentPieceWeightSlice';
import { getMachineListAsync } from '../features/machine/machineSlice';
import { getPartListAsync } from '../features/part/partSlice';
import { isFulfilled } from '@reduxjs/toolkit';

export default function Home() {
    const dispatch = useAppDispatch();

    // dependent data sets
    const apiDetails = useAppSelector(selectApiDetails);
    const packingJob: IPackingJob = useAppSelector(selectPackingJob);
    const identity: IIdentity = useAppSelector(selectIdentity);

    const load = async () => {
        if (apiDetails.port) {
            if (packingJob.part) {
                dispatch(getPartialBoxListAsync(packingJob.part!.partCode));
                dispatch(
                    getRecentPieceWeightListAsync(packingJob.part?.partCode),
                );
            }
            // is either a fulfilled or rejected action
            const machineListAction = await dispatch(getMachineListAsync());
            const partListAction = await dispatch(getPartListAsync());
            if (
                isFulfilled(machineListAction) &&
                isFulfilled(partListAction) &&
                !!packingJob.packingJobNumber
            ) {
                dispatch(getPackingJobAsync());
            }
        }
    };

    useEffect(() => {
        load();
    }, [
        dispatch,
        apiDetails,
        /*, packingJob.packingJobNumber, packingJob.part*/
    ]);

    useEffect(() => {
        const timer = setTimeout(() => load(), 60000);
        return () => clearTimeout(timer);
    }, [
        dispatch,
        load,
        apiDetails,
        packingJob.packingJobNumber,
        packingJob.part,
    ]);

    return (
        <>
            {identity?.userName ? (
                <Split
                    className="d-flex"
                    direction="horizontal"
                    sizes={[25, 75]}
                    minSize={100}
                    expandToMin={false}
                    gutterSize={10}
                    gutterAlign="center"
                    snapOffset={30}
                    dragInterval={1}
                    style={{ height: '100%', overflow: 'hidden' }}
                >
                    <Container
                        fluid
                        className="d-flex flex-column p-0"
                        style={{ overflow: 'hidden' }}
                    >
                        <Container
                            fluid
                            className="p-0"
                            style={{ overflow: 'auto', overflowX: 'hidden' }}
                        >
                            <RunJobSummary packingJob={packingJob} />
                        </Container>
                    </Container>
                    <Container
                        className="col-md-8 col-lg-6"
                        style={{ overflow: 'auto' }}
                    >
                        <Row>
                            <Col sm="8"></Col>
                        </Row>
                        <RunJob packingJob={packingJob} />
                    </Container>
                </Split>
            ) : (
                <Container className="col-md-6 col-lg-4">
                    <Login />
                </Container>
            )}
        </>
    );
}
