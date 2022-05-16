import { Card, Col, Container, Row } from '../../../bootstrap';
import { IPackingJob } from '../../../features/packingJob/packingJobSlice';
import { PartialBoxListSummary } from './PartialBoxListSummary';

export function LotQuantitySummary(props: { packingJob: IPackingJob }) {
    return (
        <Card.Body className="px-0">
            <Card.Title>Lot Quantity Summary</Card.Title>
            <Container className="m-0 p-0">
                <Row>
                    <Col className="form-label">Boxes</Col>
                </Row>
                <Row>
                    <Col className="mb-1">{`${
                        props.packingJob.boxes
                    } @ ${props.packingJob.packaging!.standardPack.toLocaleString()} each`}</Col>
                </Row>
                {props.packingJob.partialBoxQuantity && (
                    <>
                        <Row>
                            <Col className="form-label">Partial Box</Col>
                        </Row>
                        <Row>
                            <Col className="mb-1">
                                {props.packingJob.partialBoxQuantity.toLocaleString()}
                            </Col>
                        </Row>
                    </>
                )}
                <Row>
                    <Col className="form-label">Total Quantity</Col>
                </Row>
                <Row>
                    <Col className="mb-1">{`${
                        props.packingJob.boxes
                            ? `${
                                  props.packingJob.boxes
                              } @ ${props.packingJob.packaging!.standardPack.toLocaleString()}${
                                  props.packingJob.partialBoxQuantity
                                      ? ' + '
                                      : ''
                              }`
                            : ''
                    }${
                        props.packingJob.partialBoxQuantity
                            ? `${props.packingJob.partialBoxQuantity.toLocaleString()}`
                            : ''
                    } = ${(
                        (props.packingJob.boxes || 0) *
                            props.packingJob.packaging!.standardPack +
                        (props.packingJob.partialBoxQuantity || 0)
                    ).toLocaleString()} pieces`}</Col>
                </Row>
                <Row>
                    <Col className="form-label">Shelf Inventory</Col>
                </Row>
                <Row>
                    <Col className="mb-1">
                        {props.packingJob.shelfInventoryFlag ? 'Yes' : 'No'}
                    </Col>
                </Row>
                {props.packingJob.partialBoxQuantity && (
                    <>
                        <Row>
                            <Col className="form-label">Partial Box(es)</Col>
                        </Row>
                        <Row>
                            <Col className="mb-1">
                                <PartialBoxListSummary
                                    partCode={props.packingJob.part!.partCode}
                                />
                            </Col>
                        </Row>
                    </>
                )}
            </Container>
        </Card.Body>
    );
}
