import { Card, Col, Container, Row } from '../../../bootstrap';
import {} from '../../../features/packingJob/packingJobAPI';
import { IPackingJob } from '../../../features/packingJob/packingJobSlice';

export function BeginJobSummary(props: { packingJob: IPackingJob }) {
    return (
        <Card.Body className="px-0">
            <Card.Title>Job In Progress</Card.Title>
            <Container className="m-0 p-0">
                <Row>
                    <Col className="form-label">Part Number</Col>
                </Row>
                <Row>
                    <Col className="mb-1">
                        {props.packingJob.part!.partCode}
                    </Col>
                </Row>
                <Row>
                    <Col className="form-label">Package Type</Col>
                </Row>
                <Row>
                    <Col className="mb-1">
                        {props.packingJob.packaging!.packageCode}
                    </Col>
                </Row>
                <Row>
                    <Col className="form-label">Weighed</Col>
                </Row>
                <Row>
                    <Col
                        className={`mb-1 ${
                            props.packingJob.overridePieceWeight &&
                            'px-3 text-white bg-warning'
                        }`}
                    >
                        {props.packingJob.quantity} @
                        {props.packingJob.pieceWeight?.toPrecision(3)}
                        {props.packingJob.overridePieceWeight
                            ? ` !! ${props.packingJob.pieceWeightDiscrepancyNote} !!`
                            : ''}
                    </Col>
                </Row>
                <Row>
                    <Col className="form-label">Deflashed</Col>
                </Row>
                <Row>
                    <Col className="mb-1">{`By ${props.packingJob.operator} @ ${props.packingJob.machine?.machineCode}`}</Col>
                </Row>
                {props.packingJob.packaging!.specialInstructions && (
                    <>
                        <Row>
                            <Col className="form-label">
                                Special Instructions
                            </Col>
                        </Row>
                        <Row>
                            <Col className="mb-1 px-3 text-white bg-warning">
                                {
                                    props.packingJob.packaging!
                                        .specialInstructions
                                }
                            </Col>
                        </Row>
                    </>
                )}
            </Container>
        </Card.Body>
    );
}
