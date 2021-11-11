import { useAppDispatch } from '../app/hooks';
import { Button, Card, Col, Row } from '../bootstrap';
import {
    combinePartialBox,
    deleteBox,
    IPackingJob,
    printLabels,
    resetInventory,
} from '../features/packingJob/packingJobSlice';
import { InventoryBox } from './InventoryBox';

export function JobInventory(props: { packingJob: IPackingJob }) {
    const dispatch = useAppDispatch();

    function resetInventoryHandler(): void {
        if (!props.packingJob.demoJob) dispatch(resetInventory());
    }
    function deleteBoxHandler(serial: number): void {
        if (!props.packingJob.demoJob) dispatch(deleteBox(serial));
    }
    function combinePartialBoxHandler(scanData: string): void {
        if (!props.packingJob.demoJob) dispatch(combinePartialBox(scanData));
    }
    function printLabelsHandler(): void {
        if (!props.packingJob.demoJob) dispatch(printLabels());
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
                <Row xs={1} md={2} className="g-4">
                    {props.packingJob.objectList!.map((object) => (
                        <Col key={object.serial}>
                            <InventoryBox
                                object={object}
                                deleteBoxHandler={deleteBoxHandler}
                                combinePartialBoxHandler={
                                    combinePartialBoxHandler
                                }
                            />
                        </Col>
                    ))}
                </Row>
                <Button
                    className="my-3"
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
