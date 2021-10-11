import { Button, Card, Col, Form, Row } from '../bootstrap';
import { IPart } from '../features/part/partSlice';

export function BeginJobSummary(props: {
    part?: IPart;
    instructions?: string;
    acknowledged?: boolean;
    quantity?: number;
    pieceWeight?: number;
    validPieceWeight?: boolean;
    operator?: string;
    machine?: string;
    stopJobHandler?: () => void;
}) {
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
                            value={props.part?.partCode}
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
                            value={`${props.quantity} @ ${props.pieceWeight}`}
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
                            value={`By ${props.operator} @ ${props.machine}`}
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
                            value={props.part?.specialInstructions}
                        />
                    </Col>
                </Form.Group>
                <Button
                    onClick={() => {
                        if (props.stopJobHandler) props.stopJobHandler();
                    }}
                >
                    Edit Job
                </Button>
            </Form>
        </Card.Body>
    );
}
