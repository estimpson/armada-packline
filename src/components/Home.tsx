import { useAppSelector } from '../app/hooks';
import { Col, Container, Row } from '../bootstrap';
import { IIdentity, selectIdentity } from '../features/identity/identitySlice';
import {
    IPackingJob,
    selectPackingJob,
} from '../features/packingJob/packingJobSlice';
import { RunJob } from './run-job/RunJob';
import Split from 'react-split';
import { RunJobSummary } from './run-job/RunJobSummary';
import Login from './Login';

export default function Home() {
    // dependent data sets
    const packingJob: IPackingJob = useAppSelector(selectPackingJob);

    const identity: IIdentity = useAppSelector(selectIdentity);

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
