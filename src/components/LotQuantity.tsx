import {
    Button,
    Card,
    Col,
    FloatingLabel,
    Form,
    InputGroup,
    Row,
} from '../bootstrap';
import { IPart } from '../features/part/partSlice';
import { IPartPackaging } from '../features/partPackaging/partPackagingSlice';

export function LotQuantity(props: {
    part: IPart;
    packaging: IPartPackaging;

    boxes?: number;
    boxesHandler?: (boxes: number) => void;

    partialBoxQuantity?: number;
    partialBoxQuantityHandler?: (partialBoxQuantity: number) => void;

    generateInventoryHandler?: () => void;
}) {
    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>Enter Lot Quantity</Card.Title>
                <Form>
                    <Form.Group as={Row} className="mb-3">
                        <InputGroup>
                            <FloatingLabel
                                className="form-floating-group"
                                controlId="floatingInput-boxes"
                                label="Boxes"
                            >
                                <Form.Control
                                    value={props.boxes ?? ''}
                                    onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>,
                                    ) => {
                                        const target = event.target;
                                        const value =
                                            parseInt(target.value) ?? undefined;
                                        if (props.boxesHandler) {
                                            props.boxesHandler(value);
                                        }
                                    }}
                                />
                            </FloatingLabel>
                            <InputGroup.Text>
                                @ {props.packaging.standardPack}
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                    <FloatingLabel
                        controlId="floatingInput-partialboxequantity"
                        className="mb-3"
                        label="Partial Box"
                    >
                        <Form.Control
                            value={props.partialBoxQuantity ?? ''}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                                const target = event.target;
                                const value =
                                    parseInt(target.value) ?? undefined;
                                if (props.partialBoxQuantityHandler) {
                                    props.partialBoxQuantityHandler(value);
                                }
                            }}
                        />
                    </FloatingLabel>
                    {props.boxes || props.partialBoxQuantity ? (
                        <>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="3">
                                    Total Quantity
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control
                                        plaintext
                                        readOnly
                                        value={`${
                                            props.boxes
                                                ? `${props.boxes} box${
                                                      props.boxes > 1
                                                          ? 'es'
                                                          : ''
                                                  } @ ${
                                                      props.packaging
                                                          .standardPack
                                                  }${
                                                      props.partialBoxQuantity
                                                          ? ' + '
                                                          : ''
                                                  }`
                                                : ''
                                        }${
                                            props.partialBoxQuantity
                                                ? `${props.partialBoxQuantity} partial`
                                                : ''
                                        } = ${
                                            (props.boxes || 0) *
                                                props.packaging.standardPack +
                                            (props.partialBoxQuantity || 0)
                                        }`}
                                    />
                                </Col>
                            </Form.Group>
                        </>
                    ) : (
                        <></>
                    )}

                    {props.boxes || props.partialBoxQuantity ? (
                        <>
                            <Button
                                onClick={() => {
                                    if (props.generateInventoryHandler) {
                                        props.generateInventoryHandler();
                                    }
                                }}
                            >
                                Generate Inventory
                            </Button>
                        </>
                    ) : (
                        <></>
                    )}
                </Form>
            </Card.Body>
        </Card>
    );
}
