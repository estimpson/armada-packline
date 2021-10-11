import { FloatingLabel, Form, Row } from '../bootstrap';
import { IPart } from '../features/part/partSlice';

export function DeflashDetails(props: {
    part: IPart;

    operator?: string;
    operatorHandler?: (operator: string) => void;

    machine?: string;
    machineHandler?: (machine: string) => void;
}) {
    return (
        <>
            <Form.Group as={Row} className="mb-3">
                <FloatingLabel
                    controlId="floatingInput-operator"
                    label={
                        props.part.deflashMethod === 'MACHINE'
                            ? 'Deflash Operator'
                            : 'Tear Trim Operator'
                    }
                >
                    <Form.Control
                        id="floatingInput-operator"
                        value={props.operator || ''}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                            const target = event.target;
                            const value = target.value;
                            if (props.operatorHandler) {
                                props.operatorHandler(value);
                            }
                        }}
                    />
                </FloatingLabel>
            </Form.Group>
            {props.operator && (
                <Form.Group as={Row} className="mb-3">
                    <FloatingLabel
                        controlId="floatingInput-machine"
                        label={
                            props.part.deflashMethod === 'MACHINE'
                                ? 'Deflash Machine'
                                : 'Tear Trim Machine'
                        }
                    >
                        <Form.Control
                            id="floatingInput-machine"
                            value={props.machine || ''}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                                const target = event.target;
                                const value = target.value;
                                if (props.machineHandler) {
                                    props.machineHandler(value);
                                }
                            }}
                        />
                    </FloatingLabel>
                </Form.Group>
            )}
        </>
    );
}
