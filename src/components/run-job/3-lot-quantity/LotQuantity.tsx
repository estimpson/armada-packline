import { useAppDispatch } from '../../../app/hooks';
import {
    Button,
    Card,
    Col,
    FloatingLabel,
    Form,
    InputGroup,
    Row,
} from '../../../bootstrap';
import {
    generatePackingJobInventoryAsync,
    cancelPackingJobAsync,
    IPackingJob,
    setBoxes,
    setPartialBoxQuantity,
} from '../../../features/packingJob/packingJobSlice';
import { PartialBoxList } from './PartialBoxList';

export function LotQuantity(props: { packingJob: IPackingJob }) {
    const dispatch = useAppDispatch();

    function stopJobHandler(): void {
        if (!props.packingJob.demoJob) dispatch(cancelPackingJobAsync());
    }

    function boxesHandler(boxes: number): void {
        if (!props.packingJob.demoJob) dispatch(setBoxes(boxes));
    }
    function partialBoxQuantityHandler(partialBoxQuantity: number): void {
        if (!props.packingJob.demoJob)
            dispatch(setPartialBoxQuantity(partialBoxQuantity));
    }
    function generateInventoryHandler(): void {
        if (!props.packingJob.demoJob)
            dispatch(generatePackingJobInventoryAsync());
    }

    return (
        <>
            {' '}
            <Form></Form>
            <Card className="mb-3">
                <Card.Body>
                    <Button
                        variant="warning"
                        className="mb-3"
                        disabled={!!props.packingJob.objectList?.length}
                        onClick={() => {
                            stopJobHandler();
                        }}
                    >
                        Edit Job
                    </Button>
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
                                        value={props.packingJob.boxes ?? ''}
                                        onChange={(
                                            event: React.ChangeEvent<HTMLInputElement>,
                                        ) => {
                                            const target = event.target;
                                            const value =
                                                parseInt(target.value) ??
                                                undefined;
                                            boxesHandler(value);
                                        }}
                                    />
                                </FloatingLabel>
                                <InputGroup.Text>
                                    @{' '}
                                    {props.packingJob.packaging!.standardPack.toLocaleString()}
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                        <FloatingLabel
                            controlId="floatingInput-partialboxequantity"
                            className="mb-3"
                            label="Partial Box"
                        >
                            <Form.Control
                                value={
                                    props.packingJob.partialBoxQuantity ?? ''
                                }
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    const target = event.target;
                                    const value =
                                        parseInt(target.value) ?? undefined;
                                    partialBoxQuantityHandler(value);
                                }}
                            />
                        </FloatingLabel>
                        {props.packingJob.boxes ||
                        props.packingJob.partialBoxQuantity ? (
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
                                                props.packingJob.boxes
                                                    ? `${
                                                          props.packingJob.boxes
                                                      } box${
                                                          props.packingJob
                                                              .boxes > 1
                                                              ? 'es'
                                                              : ''
                                                      } @ ${props.packingJob.packaging!.standardPack.toLocaleString()}${
                                                          props.packingJob
                                                              .partialBoxQuantity
                                                              ? ' + '
                                                              : ''
                                                      }`
                                                    : ''
                                            }${
                                                props.packingJob
                                                    .partialBoxQuantity
                                                    ? `${props.packingJob.partialBoxQuantity.toLocaleString()} partial`
                                                    : ''
                                            } = ${(
                                                (props.packingJob.boxes || 0) *
                                                    props.packingJob.packaging!
                                                        .standardPack +
                                                (props.packingJob
                                                    .partialBoxQuantity || 0)
                                            ).toLocaleString()}`}
                                        />
                                    </Col>
                                </Form.Group>
                            </>
                        ) : (
                            <></>
                        )}
                        <Form.Group
                            as={Row}
                            className={
                                props.packingJob.shelfInventoryFlag
                                    ? 'mb-3 text-white bg-warning'
                                    : 'mb-3'
                            }
                        >
                            <Form.Label column sm="3">
                                Shelf Inventory
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control
                                    plaintext
                                    readOnly
                                    value={
                                        props.packingJob.shelfInventoryFlag
                                            ? 'Yes'
                                            : 'No'
                                    }
                                    className={
                                        props.packingJob.shelfInventoryFlag
                                            ? 'text-white'
                                            : ''
                                    }
                                />
                            </Col>
                        </Form.Group>
                        {props.packingJob.partialBoxQuantity ? (
                            <PartialBoxList
                                partCode={props.packingJob.part!.partCode}
                            />
                        ) : (
                            <></>
                        )}

                        {props.packingJob.boxes ||
                        props.packingJob.partialBoxQuantity ? (
                            <>
                                <Button
                                    onClick={() => {
                                        generateInventoryHandler();
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
        </>
    );
}
