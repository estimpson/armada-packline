import { Card, Col, Container, Row } from '../../../bootstrap';
import { IPackingCombinedObject } from '../../../features/packingJob/packingJobSlice';

export function CombineBoxList(props: {
    combineList: IPackingCombinedObject[];
}) {
    return (
        <>
            {props.combineList.length ? (
                <>
                    {props.combineList.map((combine) => {
                        return (
                            <Card key={combine.serial.toString()}>
                                <Card.Body className="p-2">
                                    <Container className="m-0 p-0">
                                        <Row>
                                            <Col className="m-0 form-label">
                                                Serial:
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="m-0">
                                                {combine.serial}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="m-0 form-label">
                                                Qty Original:
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="m-0">
                                                {combine.quantityOriginal.toLocaleString()}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="m-0 form-label">
                                                Qty Used:
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="m-0">
                                                {combine.quantityUsed.toLocaleString()}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="m-0 form-label">
                                                Qty Remaining:
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="m-0">
                                                {combine.quantityRemaining.toLocaleString()}
                                            </Col>
                                        </Row>
                                    </Container>
                                </Card.Body>
                            </Card>
                        );
                    })}
                </>
            ) : (
                <>
                    <Row key="none">
                        <Col>None available</Col>
                    </Row>
                </>
            )}
        </>
    );
}
