import { Card, Col, Form, Row } from '../bootstrap';
import { IPackingJob } from '../features/packingJob/packingJobSlice';

export function LotQuantitySummary(props: { packingJob: IPackingJob }) {
    return (
        <Card.Body>
            <Card.Title>Lot Quantity Summary</Card.Title>
            <Form>
                {props.packingJob.boxes && (
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="3">
                            Boxes
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control
                                plaintext
                                readOnly
                                value={`${props.packingJob.boxes} @ ${
                                    props.packingJob.packaging!.standardPack
                                }`}
                            />
                        </Col>
                    </Form.Group>
                )}

                {props.packingJob.partialBoxQuantity && (
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="3">
                            Partial Box
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control
                                plaintext
                                readOnly
                                value={props.packingJob.partialBoxQuantity}
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
                                props.packingJob.boxes
                                    ? `${props.packingJob.boxes} box${
                                          props.packingJob.boxes > 1 ? 'es' : ''
                                      } @ ${
                                          props.packingJob.packaging!
                                              .standardPack
                                      }${
                                          props.packingJob.partialBoxQuantity
                                              ? ' + '
                                              : ''
                                      }`
                                    : ''
                            }${
                                props.packingJob.partialBoxQuantity
                                    ? `${props.packingJob.partialBoxQuantity} partial`
                                    : ''
                            } = ${
                                (props.packingJob.boxes || 0) *
                                    props.packingJob.packaging!.standardPack +
                                (props.packingJob.partialBoxQuantity || 0)
                            }`}
                        />
                    </Col>
                </Form.Group>
            </Form>
        </Card.Body>
    );
}
