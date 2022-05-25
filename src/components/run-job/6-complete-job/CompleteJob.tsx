import { useAppDispatch } from '../../../app/hooks';
import { Button, Card, FloatingLabel, Form } from '../../../bootstrap';
import {
    applicationNoticeOccurred,
    ApplicationNoticeType,
    PromptType,
} from '../../../features/applicationNotice/applicationNoticeSlice';
import {
    completePackingJobAsync,
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
        if (!props.packingJob.demoJob) {
            if (props.packingJob.partialBoxQuantity && flag) {
                dispatch(
                    applicationNoticeOccurred({
                        type: ApplicationNoticeType.Warning,
                        promptType: PromptType.OkCancel,
                        message:
                            'A partial box was created.  Please confirm there is still shelf inventory.',
                        conditionalActionName: setShelfInventoryFlag.toString(),
                        conditionalActionPayload: flag,
                    }),
                );
            } else {
                dispatch(setShelfInventoryFlag(flag));
            }
        }
    }

    function completeJobHandler(): void {
        if (!props.packingJob.demoJob) dispatch(completePackingJobAsync());
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <Card.Title>Complete Job</Card.Title>
                    <Form>
                        <FloatingLabel label="Is Job Done?" className="mb-3">
                            <Form.Select
                                value={
                                    props.packingJob.jobIsDoneFlag
                                        ? 'Yes'
                                        : props.packingJob.jobIsDoneFlag ===
                                          false
                                        ? 'No'
                                        : ''
                                }
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
                                <option value="">Choose option...</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </Form.Select>
                        </FloatingLabel>
                        {props.packingJob.jobIsDoneFlag === false && (
                            <FloatingLabel
                                label="Shelf Inventory"
                                className="mb-3"
                            >
                                <Form.Select
                                    value={
                                        props.packingJob.shelfInventoryFlag
                                            ? 'Yes'
                                            : props.packingJob
                                                  .shelfInventoryFlag === false
                                            ? 'No'
                                            : ''
                                    }
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
                                    <option value="">Choose option...</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </Form.Select>
                            </FloatingLabel>
                        )}
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
