import { useAppDispatch } from '../../../app/hooks';
import { Button, Card, Col, Row, Form } from '../../../bootstrap';
import {
    applicationNoticeOccurred,
    ApplicationNoticeType,
    PromptType,
} from '../../../features/applicationNotice/applicationNoticeSlice';
import {
    deleteBox,
    IPackingJob,
    printPackingJobLablesAsync,
    resetPackingJobInventoryAsync,
} from '../../../features/packingJob/packingJobSlice';
import { InventoryBox } from './InventoryBox';

export function JobInventory(props: { packingJob: IPackingJob }) {
    const dispatch = useAppDispatch();

    function resetInventoryHandler(): void {
        if (!props.packingJob.demoJob) {
            if (props.packingJob.objectList?.find((o) => o.printed)) {
                dispatch(
                    applicationNoticeOccurred({
                        type: ApplicationNoticeType.Warning,
                        promptType: PromptType.OkCancel,
                        message:
                            'Any printed labels must be discarded if you reset the inventory for this job.',
                        conditionalActionName:
                            resetPackingJobInventoryAsync.toString(),
                    }),
                );
            } else {
                dispatch(resetPackingJobInventoryAsync());
            }
        }
    }
    function deleteBoxHandler(serial: number): void {
        if (!props.packingJob.demoJob) dispatch(deleteBox(serial));
    }
    function printLabelsHandler(): void {
        if (!props.packingJob.demoJob) dispatch(printPackingJobLablesAsync());
    }

    return (
        <>
            <Card.Body>
                <Card.Title>Inventory</Card.Title>
                <Button
                    className="mb-3"
                    onClick={() => {
                        resetInventoryHandler();
                    }}
                >
                    Reset Inventory
                </Button>
                <Row xs={1} md={2} className="g-4 mb-3">
                    {props.packingJob.objectList!.map((object) => (
                        <Col key={object.serial}>
                            <InventoryBox
                                object={object}
                                deleteBoxHandler={deleteBoxHandler}
                            />
                        </Col>
                    ))}
                </Row>
                {props.packingJob.packaging!.specialInstructions && (
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="3">
                            Special Instructions
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control
                                className="px-3 text-white bg-warning"
                                plaintext
                                readOnly
                                value={
                                    props.packingJob.packaging!
                                        .specialInstructions
                                }
                            />
                        </Col>
                    </Form.Group>
                )}
                <Button
                    className="my-3"
                    disabled={!props.packingJob.objectList?.length}
                    onClick={() => {
                        printLabelsHandler();
                    }}
                >
                    Print Labels
                </Button>
            </Card.Body>
        </>
    );
}
