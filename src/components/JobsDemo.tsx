import { useEffect, useState } from 'react';
import { Col, Container, Row } from '../bootstrap';
import { RunJob } from './RunJob';
import { DemoJobs } from '../data/demo/DemoJobs';
import { IJob } from '../data/Job';

export default function JobsDemo() {
    const [jobs, SetJobs] = useState<IJob[]>([]);

    useEffect(() => {
        SetJobs(DemoJobs);
    }, [jobs]);

    return (
        <Container className="col-6">
            <Row>
                <Col sm="8">
                    <p className="fs-1">Fx Pack Line</p>
                </Col>
                <Col sm="4">
                    <p className="fs-6">Logged in as [User]</p>
                </Col>
            </Row>
            <p className="fs-3">Starting a new job</p>
            {jobs &&
                jobs.map((job) => {
                    return (
                        <RunJob
                            key={job.step}
                            step={job.step}
                            part={job.part}
                            instructions={job.instructions}
                            acknowledged={job.acknowledged}
                            quantity={job.quantity}
                            pieceWeight={job.pieceWeight}
                            valid={job.valid}
                            operator={job.operator}
                            machine={job.machine}
                            jobInProgress={job.jobInProgress}
                            standardPack={job.standardPack}
                            boxes={job.boxes}
                            partialBoxQuantity={job.partialBoxQuantity}
                            objectList={job.objectList}
                        />
                    );
                })}
        </Container>
    );
}
