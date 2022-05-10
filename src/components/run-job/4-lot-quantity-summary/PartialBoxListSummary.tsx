import { useSelector } from 'react-redux';
import { selectPartialBoxList } from '../../../features/partialBox/partialBoxListSlice';
import { Card, Col, Container, Row } from '../../../bootstrap';

export function PartialBoxListSummary(props: { partCode: string }) {
    const partialBoxes = useSelector(selectPartialBoxList);

    return (
        <>
            {partialBoxes.length ? (
                <>
                    {partialBoxes.map((partialBox) => {
                        return (
                            <Card key={partialBox.serial.toString()}>
                                <Card.Body className="p-2">
                                    <Container className="m-0 p-0">
                                        <Row>
                                            <Col className="m-0 form-label">
                                                Serial:
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="m-0">
                                                {partialBox.serial}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="m-0 form-label">
                                                Qty:
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="m-0">
                                                {partialBox.quantity.toLocaleString()}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="m-0 form-label">
                                                Pkg:
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="m-0">
                                                {partialBox.packageType}
                                            </Col>
                                        </Row>
                                        {partialBox.notes && (
                                            <>
                                                <Row>
                                                    <Col className="m-0 form-label">
                                                        Notes:
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col className="m-0">
                                                        {partialBox.notes}
                                                    </Col>
                                                </Row>
                                            </>
                                        )}
                                        <Row>
                                            <Col className="m-0 form-label">
                                                LastDate:
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="m-0">
                                                {new Date(
                                                    partialBox.lastDate,
                                                ).toLocaleDateString()}
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
