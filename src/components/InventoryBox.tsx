import { Button, Card, FloatingLabel, Form } from '../bootstrap';
import { IPart } from '../features/part/partSlice';

export function InventoryBox(props: {
    serial: number;
    part: IPart;
    quantity: number;
    partial: boolean;
}) {
    return (
        <Card>
            <Card.Body>
                <Card.Title>{`S${props.serial}${
                    props.partial ? ' [Partial]' : ''
                }`}</Card.Title>
                <Form>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Part"
                        className="mb-3"
                    >
                        <Form.Control readOnly value={props.part.partCode} />
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Quantity"
                        className="mb-3"
                    >
                        <Form.Control value={props.quantity} />
                    </FloatingLabel>
                    {props.partial && (
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Scan partial S3521477 (qty 35) to combine"
                            className="mb-3"
                        >
                            <Form.Control />
                        </FloatingLabel>
                    )}
                </Form>
                <Button>Delete Box</Button>
            </Card.Body>
        </Card>
    );
}
