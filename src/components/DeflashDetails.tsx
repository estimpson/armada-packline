import { FloatingLabel, Form } from '../bootstrap';
import { IMachine } from '../features/machine/machineSlice';
import { IPart } from '../features/part/partSlice';
import { SelectMachine } from './SelectMachine';

export function DeflashDetails(props: {
    part: IPart;

    operator?: string;
    operatorHandler?: (operator: string) => void;

    machine?: IMachine;
    machineHandler?: (machine: IMachine | undefined) => void;
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
                <SelectMachine
                    label={
                        props.part.deflashMethod === 'MACHINE'
                            ? 'Deflash Machine'
                            : 'Tear Trim Machine'
                    }
                    machine={props.machine}
                    machineSetter={props.machineHandler}
                />
            )}
        </>
    );
}
