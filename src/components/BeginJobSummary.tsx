import { useAppDispatch } from '../app/hooks';
import { Button, Card, Col, Form, Row } from '../bootstrap';
import { IPackingJob, stopJob } from '../features/packingJob/packingJobSlice';

export function BeginJobSummary(props: { packingJob: IPackingJob }) {
    const dispatch = useAppDispatch();

    function stopJobHandler(): void {
        if (!props.packingJob.demoJob) dispatch(stopJob());
    }

    return (
        <Card.Body>
            <Card.Title>Job In Progress</Card.Title>
            <Form>
                <Form.Group as={Row}>
                    <Form.Label column sm="3" className="mb-3">
                        Part Number
                    </Form.Label>
                    <Col sm="9">
                        <Form.Control
                            plaintext
                            readOnly
                            value={props.packingJob.part!.partCode}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm="3" className="mb-3">
                        Weighed
                    </Form.Label>
                    <Col sm="9">
                        <Form.Control
                            plaintext
                            readOnly
                            value={`${props.packingJob.quantity} @ ${props.packingJob.pieceWeight}`}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm="3" className="mb-3">
                        Deflashed
                    </Form.Label>
                    <Col sm="9">
                        <Form.Control
                            plaintext
                            readOnly
                            value={`By ${props.packingJob.operator} @ ${props.packingJob.machine?.machineCode}`}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm="3" className="mb-3">
                        Special Instructions
                    </Form.Label>
                    <Col sm="9">
                        <Form.Control
                            className="px-3 text-white bg-warning"
                            plaintext
                            readOnly
                            value={
                                props.packingJob.packaging!.specialInstructions
                            }
                        />
                    </Col>
                </Form.Group>
                <Button
                    disabled={!!props.packingJob.objectList?.length}
                    onClick={() => {
                        stopJobHandler();
                    }}
                >
                    Edit Job
                </Button>
            </Form>
        </Card.Body>
    );
}
