import { useAppDispatch } from '../../../app/hooks';
import { Button, Card, Col, Form, Row } from '../../../bootstrap';
import {} from '../../../features/packingJob/packingJobAPI';
import {
    cancelPackingJobAsync,
    IPackingJob,
} from '../../../features/packingJob/packingJobSlice';

export function BeginJobSummary(props: { packingJob: IPackingJob }) {
    const dispatch = useAppDispatch();

    function stopJobHandler(): void {
        if (!props.packingJob.demoJob) dispatch(cancelPackingJobAsync());
    }

    return (
        <Card.Body className="px-0">
            <Card.Title>Job In Progress</Card.Title>
            <p className="form-label">Part Number</p>
            <p className="mb-1">{props.packingJob.part!.partCode}</p>
            <p className="form-label">Package Type</p>
            <p className="mb-1">{props.packingJob.packaging!.packageCode}</p>
            <p className="form-label">Weighed</p>
            <p
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
            </p>
            <p className="form-label">Deflashed</p>
            <p className="mb-1">{`By ${props.packingJob.operator} @ ${props.packingJob.machine?.machineCode}`}</p>
            {props.packingJob.packaging!.specialInstructions && (
                <>
                    <p className="form-label">Special Instructions</p>
                    <p className="mb-1 px-3 text-white bg-warning">
                        {props.packingJob.packaging!.specialInstructions}
                    </p>
                </>
            )}
        </Card.Body>
    );
}
