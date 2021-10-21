import { Card, Col, FloatingLabel, Form, Row } from '../bootstrap';
import { IPart } from '../features/part/partSlice';

export function LotQuantitySummary(props: {
    part: IPart;

    boxes?: number;

    partialBoxQuantity?: number;
}) {
    return (
        <Card.Body>
            <Card.Title>Lot Quantity Summary</Card.Title>
            <Form>
                {props.boxes && (
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="3">
                            Boxes
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control
                                plaintext
                                readOnly
                                value={`${props.boxes} @ ${props.part.standardPack}`}
                            />
                        </Col>
                    </Form.Group>
                )}

                {props.partialBoxQuantity && (
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="3">
                            Partial Box
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control
                                plaintext
                                readOnly
                                value={props.partialBoxQuantity}
                            />
                        </Col>
                    </Form.Group>
                )}

                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                        Total Quantity
                    </Form.Label>
                    <Col sm="9">
                        <Form.Control
                            plaintext
                            readOnly
                            value={`${
                                props.boxes
                                    ? `${props.boxes} box${
                                          props.boxes > 1 ? 'es' : ''
                                      } @ ${props.part.standardPack}${
                                          props.partialBoxQuantity ? ' + ' : ''
                                      }`
                                    : ''
                            }${
                                props.partialBoxQuantity
                                    ? `${props.partialBoxQuantity} partial`
                                    : ''
                            } = ${
                                (props.boxes || 0) * props.part.standardPack +
                                (props.partialBoxQuantity || 0)
                            }`}
                        />
                    </Col>
                </Form.Group>
            </Form>
        </Card.Body>
    );
}
