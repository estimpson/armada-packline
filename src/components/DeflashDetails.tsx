import { useAppDispatch } from '../app/hooks';
import { FloatingLabel, Form } from '../bootstrap';
import { IMachine } from '../features/machine/machineSlice';
import {
    IPackingJob,
    setMachine,
    setOperator,
} from '../features/packingJob/packingJobSlice';
import { SelectMachine } from './SelectMachine';

export function DeflashDetails(props: { packingJob: IPackingJob }) {
    const dispatch = useAppDispatch();

    function operatorHandler(operator: string): void {
        if (!props.packingJob.demoJob) dispatch(setOperator(operator));
    }
    function machineHandler(machine: IMachine | undefined): void {
        if (!props.packingJob.demoJob) dispatch(setMachine(machine));
    }

    return (
        <>
            <FloatingLabel
                controlId="floatingInput-operator"
                className="mb-3"
                label={
                    props.packingJob.part!.deflashMethod === 'MACHINE'
                        ? 'Deflash Operator'
                        : 'Tear Trim Operator'
                }
            >
                <Form.Control
                    value={props.packingJob.operator || ''}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const target = event.target;
                        const value = target.value;
                        operatorHandler(value);
                    }}
                />
            </FloatingLabel>
            {props.packingJob.operator && (
                <SelectMachine
                    label={
                        props.packingJob.part!.deflashMethod === 'MACHINE'
                            ? 'Deflash Machine'
                            : 'Tear Trim Machine'
                    }
                    machine={props.packingJob.machine}
                    machineSetter={machineHandler}
                />
            )}
        </>
    );
}
