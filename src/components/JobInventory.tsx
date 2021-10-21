import { Button, Card, Col, Row } from '../bootstrap';
import { IPart } from '../features/part/partSlice';
import { InventoryBox } from './InventoryBox';

export function JobInventory(props: {
    part: IPart;
    objectList: {
        serial: number;
        quantity: number;
        partial: boolean;
        printed: boolean;
    }[];
    resetInventoryHandler?: () => void;
    deleteBoxHandler?: (serial: number) => void;
    scanPartialToComabineHandler?: (scanData: string) => void;
    printLabelsHandler?: () => void;
    combinePartialBoxHandler?: (scanData: string) => void;
}) {
    return (
        <>
            <Card.Body>
                <Card.Title>Inventory</Card.Title>
                <Button
                    className="mb-3"
                    onClick={() => {
                        if (props.resetInventoryHandler) {
                            props.resetInventoryHandler();
                        }
                    }}
                >
                    Reset Inventory
                </Button>
                <Row xs={1} md={2} className="g-4">
                    {props.objectList.map((object) => (
                        <Col key={object.serial}>
                            <InventoryBox
                                part={props.part!}
                                object={object}
                                deleteBoxHandler={props.deleteBoxHandler}
                                combinePartialBoxHandler={
                                    props.combinePartialBoxHandler
                                }
                            />
                        </Col>
                    ))}
                </Row>
                <Button
                    className="my-3"
                    onClick={() => {
                        props.printLabelsHandler && props.printLabelsHandler();
                    }}
                >
                    Print Labels
                </Button>
            </Card.Body>
        </>
    );
}
