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
            <FloatingLabel
                controlId="floatingInput-operator"
                className="mb-3"
                label={
                    props.part.deflashMethod === 'MACHINE'
                        ? 'Deflash Operator'
                        : 'Tear Trim Operator'
                }
            >
                <Form.Control
                    value={props.operator || ''}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const target = event.target;
                        const value = target.value;
                        if (props.operatorHandler) {
                            props.operatorHandler(value);
                        }
                    }}
                />
            </FloatingLabel>
            {props.operator && (
                <FloatingLabel
                    controlId="floatingInput-machine"
                    className="mb-3"
                    label={
                        props.part.deflashMethod === 'MACHINE'
                            ? 'Deflash Machine'
                            : 'Tear Trim Machine'
                    }
                >
                    <Form.Control
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
            )}
        </>
    );
}
