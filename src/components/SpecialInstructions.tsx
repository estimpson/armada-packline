import { Col, Form, Row } from '../bootstrap';

export function SpecialInstructions(props: {
    instructions: string;
    acknowledged: boolean;
    acknowledgementHandler?: (acknowledged: boolean) => void;
}) {
    return (
        <>
            <Form.Group
                as={Row}
                className={
                    props.acknowledged
                        ? 'mb-1 text-white bg-warning'
                        : 'mb-1 text-white bg-danger'
                }
            >
                <Form.Label column sm="3">
                    Special Instructions
                </Form.Label>
                <Col sm="9">
                    <Form.Control
                        as="textarea"
                        rows={3}
                        plaintext
                        readOnly
                        value={props.instructions}
                        className={props.acknowledged ? '' : 'text-white'}
                    />
                </Col>
            </Form.Group>
            <Row className="mb-3">
                <Col sm="3"></Col>
                <Col sm="9">
                    <Form.Check
                        label="Acknowlege"
                        checked={props.acknowledged}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                            const target = event.target;
                            const checked = target.checked;
                            if (props.acknowledgementHandler) {
                                props.acknowledgementHandler(checked);
                            }
                        }}
                    />
                </Col>
            </Row>
        </>
    );
}
