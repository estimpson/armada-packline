import { Card, Col, FloatingLabel, Form, Row } from '../../../bootstrap';
import { IPackingObject } from '../../../features/packingJob/packingJobSlice';
import { CombineBoxList } from './CombineBoxList';

export function InventoryBox(props: {
    object: IPackingObject;
    deleteBoxHandler?: (serial: number) => void;
}) {
    return (
        <Card>
            <Card.Body>
                <Card.Title>{`S${props.object.serial}${
                    props.object.partial ? ' [Partial]' : ''
                }${props.object.printed ? ' -- Printed' : ''}`}</Card.Title>
                <Form>
                    <FloatingLabel
                        controlId="floatingInput-part"
                        label="Part"
                        className="mb-3"
                    >
                        <Form.Control
                            readOnly
                            value={props.object.part.partCode}
                        />
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Quantity"
                        className="mb-3"
                    >
                        <Form.Control
                            readOnly
                            value={`${props.object.quantity}${
                                props.object.partial &&
                                !!props.object.combinedObjects?.length
                                    ? `  |  ${
                                          props.object.quantity +
                                          props.object.combinedObjects!.reduce(
                                              (combinedQty, co) =>
                                                  combinedQty +
                                                  co!.quantityUsed,
                                              0,
                                          )
                                      } after all combine(s)`
                                    : ''
                            }`}
                        />
                    </FloatingLabel>
                    {props.object.partial && !!props.object.combinedObjects && (
                        <>
                            <Row>
                                <Col className="form-label">
                                    Combined Box(es)
                                </Col>
                            </Row>

                            <CombineBoxList
                                combineList={props.object.combinedObjects!}
                            />
                        </>
                    )}
                </Form>
            </Card.Body>
        </Card>
    );
}
