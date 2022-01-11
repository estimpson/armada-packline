import { useAppDispatch } from '../../../app/hooks';
import { Button, Card, FloatingLabel, Form } from '../../../bootstrap';
import {
    completeJob,
    IPackingJob,
    setJobIsDoneFlag,
    setShelfInventoryFlag,
} from '../../../features/packingJob/packingJobSlice';

export function CompleteJob(props: { packingJob: IPackingJob }) {
    const dispatch = useAppDispatch();

    function jobIsDoneHandler(flag: boolean | undefined): void {
        if (!props.packingJob.demoJob) dispatch(setJobIsDoneFlag(flag));
    }

    function shelfInventoryHandler(flag: boolean | undefined): void {
        if (!props.packingJob.demoJob) dispatch(setShelfInventoryFlag(flag));
    }

    function completeJobHandler(): void {
        if (!props.packingJob.demoJob) dispatch(completeJob());
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <Card.Title>Complete Job</Card.Title>
                    <Form>
                        <FloatingLabel label="Is Job Done?" className="mb-3">
                            <Form.Select
                                onChange={(
                                    event: React.ChangeEvent<HTMLSelectElement>,
                                ) => {
                                    const target = event.target;
                                    const value = target.value;
                                    const flag =
                                        value === 'Yes'
                                            ? true
                                            : value === 'No'
                                            ? false
                                            : undefined;
                                    jobIsDoneHandler(flag);
                                }}
                            >
                                <option>Choose option...</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </Form.Select>
                        </FloatingLabel>
                        <FloatingLabel label="Shelf Inventory" className="mb-3">
                            <Form.Select
                                onChange={(
                                    event: React.ChangeEvent<HTMLSelectElement>,
                                ) => {
                                    const target = event.target;
                                    const value = target.value;
                                    const flag =
                                        value === 'Yes'
                                            ? true
                                            : value === 'No'
                                            ? false
                                            : undefined;
                                    shelfInventoryHandler(flag);
                                }}
                            >
                                <option>Choose option...</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </Form.Select>
                        </FloatingLabel>
                    </Form>
                    <Button
                        disabled={
                            props.packingJob.jobIsDoneFlag === undefined ||
                            props.packingJob.shelfInventoryFlag === undefined
                        }
                        onClick={() => {
                            completeJobHandler();
                        }}
                    >
                        Complete Job
                    </Button>
                </Card.Body>
            </Card>
        </>
    );
}
