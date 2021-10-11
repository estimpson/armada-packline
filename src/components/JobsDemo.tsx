import { useEffect, useState } from 'react';
import { Col, Container, Row } from '../bootstrap';
import { RunJob } from './RunJob';
import {
    DemoJobs,
    IDemoPackingJob,
} from '../features/packingJob/demo/demoPackingJobs';

export default function JobsDemo() {
    const [jobs, SetJobs] = useState<IDemoPackingJob[]>([]);

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
                            packingJob={job}
                        />
                    );
                })}
        </Container>
    );
}
