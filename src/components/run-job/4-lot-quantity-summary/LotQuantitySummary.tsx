import { Card, Col, Form, Row } from '../../../bootstrap';
import { IPackingJob } from '../../../features/packingJob/packingJobSlice';
import { PartialBoxListSummary } from './PartialBoxListSummary';

export function LotQuantitySummary(props: { packingJob: IPackingJob }) {
    return (
        <Card.Body className="px-0">
            <Card.Title>Lot Quantity Summary</Card.Title>
            <p className="form-label">Boxes</p>
            <p className="mb-1">
                {`${
                    props.packingJob.boxes
                } @ ${props.packingJob.packaging!.standardPack.toLocaleString()} each`}
            </p>
            {props.packingJob.partialBoxQuantity && (
                <>
                    <p className="form-label">Partial Box</p>
                    <p className="mb-1">
                        {props.packingJob.partialBoxQuantity.toLocaleString()}
                    </p>
                </>
            )}
            <p className="form-label">Total Quantity</p>
            <p className="mb-1">{`${
                props.packingJob.boxes
                    ? `${
                          props.packingJob.boxes
                      } @ ${props.packingJob.packaging!.standardPack.toLocaleString()}${
                          props.packingJob.partialBoxQuantity ? ' + ' : ''
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
            ).toLocaleString()} pieces`}</p>
            <p className="form-label">Shelf Inventory</p>
            <p className="mb-1">
                {props.packingJob.shelfInventoryFlag ? 'Yes' : 'No'}
            </p>
            <p className="form-label">Partial Box(es)</p>
            <p className="mb-1">
                <PartialBoxListSummary
                    partCode={props.packingJob.part!.partCode}
                />
            </p>
        </Card.Body>
    );
}
