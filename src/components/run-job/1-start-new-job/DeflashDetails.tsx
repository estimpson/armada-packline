import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { FloatingLabel, Form } from '../../../bootstrap';
import {
    IMachine,
    selectMachineList,
} from '../../../features/machine/machineSlice';
import {
    IPackingJob,
    setMachine,
    setOperator,
} from '../../../features/packingJob/packingJobSlice';
import { IListItem, ObjectSelect } from '../../shared/ObjectSelect';

export function DeflashDetails(props: { packingJob: IPackingJob }) {
    const dispatch = useAppDispatch();

    // dependent data sets
    const machineList: IMachine[] = useAppSelector(selectMachineList);

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
                <ObjectSelect
                    valueList={
                        machineList.map((machine) => {
                            return {
                                displayValue: machine.machineCode,
                                selectListValue: `${machine.machineCode} - ${machine.machineDescription}`,
                                value: machine,
                            };
                        }) || new Array<IListItem<IMachine>>()
                    }
                    label={
                        props.packingJob.part!.deflashMethod === 'MACHINE'
                            ? 'Deflash Machine'
                            : 'Tear Trim Machine'
                    }
                    currentValue={props.packingJob.machine?.machineCode}
                    setter={machineHandler}
                />
            )}
        </>
    );
}
