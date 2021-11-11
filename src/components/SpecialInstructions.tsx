import { useAppDispatch } from '../app/hooks';
import { Col, Form, Row } from '../bootstrap';
import {
    IPackingJob,
    setAcknowledged,
} from '../features/packingJob/packingJobSlice';

export function SpecialInstructions(props: { packingJob: IPackingJob }) {
    const dispatch = useAppDispatch();

    function acknowledgementHandler(acknowledged: boolean): void {
        if (!props.packingJob.demoJob) dispatch(setAcknowledged(acknowledged));
    }

    return (
        <>
            <Form.Group
                as={Row}
                className={
                    props.packingJob.acknowledged
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
                        value={
                            props.packingJob.packaging?.specialInstructions ||
                            ''
                        }
                        className={
                            props.packingJob.acknowledged ? '' : 'text-white'
                        }
                    />
                </Col>
            </Form.Group>
            <Row className="mb-3">
                <Col sm="3"></Col>
                <Col sm="9">
                    <Form.Check
                        label="Acknowlege"
                        checked={props.packingJob.acknowledged}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                            const target = event.target;
                            const checked = target.checked;
                            acknowledgementHandler(checked);
                        }}
                    />
                </Col>
            </Row>
        </>
    );
}
