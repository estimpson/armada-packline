import {
    Button,
    Card,
    Col,
    FloatingLabel,
    Form,
    InputGroup,
    Row,
} from '../bootstrap';
import { IPart } from '../data/Part';

function SelectPart(props: {
    partList?: IPart[];
    part?: string;
    partSetter?: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
    return (
        <Form.Group as={Row}>
            <Form.Label column sm="3" className="mb-3">
                Select Part Number
            </Form.Label>
            <Col sm="9">
                <Form.Select
                    value={props.part}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                        const target = event.target;
                        const value = target.value;
                        if (props.partSetter) {
                            props.partSetter(value !== '' ? value : undefined);
                        }
                    }}
                >
                    <option value="">[None selected]</option>
                    {props.partList ? (
                        props.partList.map((part) => {
                            return (
                                <option
                                    value={part.partCode}
                                    key={part.partCode}
                                >{`${part.partCode} - ${
                                    part.partDescription
                                } # ${part.unitWeight} +/- ${
                                    part.unitWeight * part.weightTolerance
                                }`}</option>
                            );
                        })
                    ) : (
                        <>
                            <option value="1">XXX</option>
                            <option value="2">YYY</option>
                            <option value="3">ZZZ</option>
                        </>
                    )}
                </Form.Select>
            </Col>
        </Form.Group>
    );
}

function SpecialInstructions(props: {
    instructions: string;
    acknowledged: boolean;
    acknowledgeHandler?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <>
            <Form.Group
                as={Row}
                className={
                    props.acknowledged ? 'mb-1' : 'mb-1 text-white bg-danger'
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
                            if (props.acknowledgeHandler) {
                                props.acknowledgeHandler(checked);
                            }
                        }}
                    />
                </Col>
            </Row>
        </>
    );
}

function VerifyPieceWeight(props: {
    quantity?: number;
    pieceWeight?: number;
    valid?: boolean;
}) {
    return (
        <>
            <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">
                    Piece Weight Quantity
                </Form.Label>
                <Col sm="9">
                    <Form.Control type="number" value={props.quantity} />
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-1">
                <Form.Label column sm="3">
                    Piece Weight Pounds
                </Form.Label>
                <Col sm="9">
                    <Form.Control type="number" value={props.pieceWeight} />
                </Col>
            </Form.Group>
            {props.quantity && props.pieceWeight ? (
                <>
                    <Form.Group as={Row} className="mb-3">
                        <Col sm="3"></Col>
                        <Col sm="9">
                            <p>Piece weight appears valid [+/- 0.25%]</p>
                        </Col>
                    </Form.Group>
                    {!props.valid ? (
                        <>
                            <p>or...</p>
                            <Form.Group
                                as={Row}
                                className="mb-3 text-white bg-danger"
                            >
                                <Col sm="3"></Col>
                                <Col sm="9">
                                    <p>
                                        Piece weight exceeds tolerance [+/-
                                        5.25%]
                                    </p>
                                </Col>
                            </Form.Group>
                            <p className="fst-italics text-white bg-warning px-2">
                                What do we want to do at this point if the piece
                                weight is out of tolerance? Should we add a
                                "notify quality inspector" button and let them
                                proceed to label or not?
                            </p>
                        </>
                    ) : (
                        <></>
                    )}
                </>
            ) : (
                <></>
            )}
        </>
    );
}

function DeflashDetails(props: { operator?: string; machine?: string }) {
    return (
        <>
            {' '}
            <Form.Group as={Row}>
                <Form.Label column sm="3" className="mb-3">
                    Deflash Operator
                </Form.Label>
                <Col sm="9">
                    <Form.Control value={props.operator}></Form.Control>
                </Col>
                <Form.Label column sm="3" className="mb-3">
                    Deflash Machine
                </Form.Label>
                <Col sm="9">
                    <Form.Control value={props.machine}></Form.Control>
                </Col>
            </Form.Group>
            {props.operator && props.machine ? (
                <>
                    <Button>Open Job</Button>
                </>
            ) : (
                <></>
            )}
        </>
    );
}

function StartNewJob(props: {
    partList?: IPart[];

    part?: string;
    partSetter?: React.Dispatch<React.SetStateAction<string | undefined>>;

    instructions?: string;
    acknowledged?: boolean;
    acknowledgeHandler?: React.Dispatch<React.SetStateAction<boolean>>;

    quantity?: number;
    pieceWeight?: number;
    valid?: boolean;
    operator?: string;
    machine?: string;
    jobInProgress?: boolean;
}) {
    return (
        <>
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>Begin New Job</Card.Title>
                    <Form>
                        <SelectPart
                            partList={props.partList}
                            part={props.part}
                            partSetter={props.partSetter}
                        />
                        {props.part && props.instructions && (
                            <SpecialInstructions
                                instructions={props.instructions || ''}
                                acknowledged={props.acknowledged || false}
                                acknowledgeHandler={props.acknowledgeHandler}
                            />
                        )}
                        {props.part &&
                            (!props.instructions || props.acknowledged) && (
                                <VerifyPieceWeight
                                    quantity={props.quantity}
                                    pieceWeight={props.pieceWeight}
                                    valid={true}
                                />
                            )}
                        {props.part &&
                            (!props.instructions || props.acknowledged) &&
                            props.valid && (
                                <DeflashDetails
                                    operator={props.operator}
                                    machine={props.machine}
                                />
                            )}
                    </Form>
                </Card.Body>
            </Card>
        </>
    );
}

function BeginJobSummary(props: {
    part?: string;
    instructions?: string;
    acknowledged?: boolean;
    quantity?: number;
    pieceWeight?: number;
    valid?: boolean;
    operator?: string;
    machine?: string;
}) {
    return (
        <Card.Body>
            <Card.Title>Job In Progress</Card.Title>
            <Form>
                <Form.Group as={Row}>
                    <Form.Label column sm="3" className="mb-3">
                        Part Number
                    </Form.Label>
                    <Col sm="9">
                        <Form.Control plaintext readOnly value={props.part} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm="3" className="mb-3">
                        Weighed
                    </Form.Label>
                    <Col sm="9">
                        <Form.Control
                            plaintext
                            readOnly
                            value={`${props.quantity} @ ${props.pieceWeight}`}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm="3" className="mb-3">
                        Deflashed
                    </Form.Label>
                    <Col sm="9">
                        <Form.Control
                            plaintext
                            readOnly
                            value={`By ${props.operator} @ ${props.machine}`}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm="3" className="mb-3">
                        Special Instructions
                    </Form.Label>
                    <Col sm="9">
                        <Form.Control
                            plaintext
                            readOnly
                            value={props.instructions}
                        />
                    </Col>
                </Form.Group>
            </Form>
        </Card.Body>
    );
}

function LotQuantity(props: {
    standardPack: number;
    boxes?: number;
    partialBoxQuantity?: number;
}) {
    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>Enter Lot Quantity</Card.Title>
                <Form>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="3">
                            Boxes
                        </Form.Label>
                        <Col sm="9">
                            <InputGroup>
                                <Form.Control value={props.boxes} />
                                <InputGroup.Text>
                                    @ {props.standardPack}
                                </InputGroup.Text>
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="3">
                            Partial Box
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control value={props.partialBoxQuantity} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="3">
                            Total Quantity
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control
                                plaintext
                                readOnly
                                value={`${props.boxes} boxes @ ${
                                    props.standardPack
                                } = ${
                                    (props.boxes || 0) * props.standardPack
                                } ${
                                    props.partialBoxQuantity &&
                                    `+ ${props.partialBoxQuantity} partial`
                                } = ${
                                    (props.boxes || 0) * props.standardPack +
                                    (props.partialBoxQuantity || 0)
                                } total`}
                            />
                        </Col>
                    </Form.Group>
                    {props.boxes ? (
                        <>
                            <Button>Generate Inventory</Button>
                        </>
                    ) : (
                        <></>
                    )}
                </Form>
            </Card.Body>
        </Card>
    );
}

function LotQuantitySummary(props: {
    standardPack: number;
    boxes?: number;
    partialBoxQuantity?: number;
}) {
    return (
        <Card.Body>
            <Card.Title>Lot Quantity Summary</Card.Title>
            <Form>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                        Boxes
                    </Form.Label>
                    <Col sm="9">
                        <Form.Control
                            plaintext
                            readOnly
                            value={`${props.boxes} @ ${props.standardPack}`}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                        Partial Box
                    </Form.Label>
                    <Col sm="9">
                        <Form.Control
                            plaintext
                            readOnly
                            value={props.partialBoxQuantity}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                        Total Quantity
                    </Form.Label>
                    <Col sm="9">
                        <Form.Control
                            plaintext
                            readOnly
                            value={`${props.boxes} boxes @ ${
                                props.standardPack
                            } = ${(props.boxes || 0) * props.standardPack} ${
                                props.partialBoxQuantity &&
                                `+ ${props.partialBoxQuantity} partial`
                            } = ${
                                (props.boxes || 0) * props.standardPack +
                                (props.partialBoxQuantity || 0)
                            } total`}
                        />
                    </Col>
                </Form.Group>
            </Form>
        </Card.Body>
    );
}

function InventoryBox(props: {
    serial: number;
    part: string;
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
                        <Form.Control readOnly value={props.part} />
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

export function RunJob(props: {
    partList?: IPart[];

    part?: string;
    partSetter?: React.Dispatch<React.SetStateAction<string | undefined>>;

    instructions?: string;
    acknowledged?: boolean;
    acknowledgeHandler?: React.Dispatch<React.SetStateAction<boolean>>;

    step?: string;
    quantity?: number;
    pieceWeight?: number;
    valid?: boolean;
    operator?: string;
    machine?: string;
    jobInProgress?: boolean;
    standardPack?: number;
    boxes?: number;
    partialBoxQuantity?: number;
    objectList?: {
        serial: number;
        quantity: number;
        partial: boolean;
    }[];
}) {
    return (
        <>
            <p className="fs-5">{props.step}</p>
            {!props.jobInProgress ? (
                <StartNewJob
                    partList={props.partList}
                    part={props.part}
                    partSetter={props.partSetter}
                    instructions={props.instructions}
                    acknowledged={props.acknowledged}
                    acknowledgeHandler={props.acknowledgeHandler}
                    quantity={props.quantity}
                    pieceWeight={props.pieceWeight}
                    valid={props.valid}
                    operator={props.operator}
                    machine={props.machine}
                />
            ) : (
                <BeginJobSummary
                    part={props.part}
                    instructions={props.instructions}
                    acknowledged={props.acknowledged}
                    quantity={props.quantity}
                    pieceWeight={props.pieceWeight}
                    valid={props.valid}
                    operator={props.operator}
                    machine={props.machine}
                />
            )}
            {props.jobInProgress &&
                (!props.objectList?.length ? (
                    <LotQuantity
                        standardPack={props.standardPack || 0}
                        boxes={props.boxes}
                        partialBoxQuantity={props.partialBoxQuantity}
                    />
                ) : (
                    <>
                        <LotQuantitySummary
                            standardPack={props.standardPack || 0}
                            boxes={props.boxes}
                            partialBoxQuantity={props.partialBoxQuantity}
                        />
                        <Card.Body>
                            <Card.Title>Inventory</Card.Title>
                            <Row xs={1} md={2} className="g-4">
                                {props.objectList.map((object) => (
                                    <Col>
                                        <InventoryBox
                                            serial={object.serial}
                                            part={props.part ?? ''}
                                            quantity={object.quantity}
                                            partial={object.partial}
                                        />
                                    </Col>
                                ))}
                            </Row>
                            <Button>Print Labels</Button>
                        </Card.Body>
                    </>
                ))}
        </>
    );
}
