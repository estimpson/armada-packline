import { Button, Card, Col, Form, Row } from '../bootstrap';
import { IMachine } from '../features/machine/machineSlice';
import { IPart } from '../features/part/partSlice';
import { IPartPackaging } from '../features/partPackaging/partPackagingSlice';

export function BeginJobSummary(props: {
    part?: IPart;
    packaging?: IPartPackaging;
    acknowledged?: boolean;
    quantity?: number;
    pieceWeight?: number;
    validPieceWeight?: boolean;
    operator?: string;
    machine?: IMachine;
    objectList?: any[];
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
                            value={`By ${props.operator} @ ${props.machine?.machineCode}`}
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
                            value={props.packaging?.specialInstructions}
                        />
                    </Col>
                </Form.Group>
                <Button
                    disabled={!!props.objectList?.length}
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
