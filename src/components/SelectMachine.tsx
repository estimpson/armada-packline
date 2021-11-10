import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { FloatingLabel, Form, Row } from '../bootstrap';
import {
    getMachineList,
    IMachine,
    selectMachineList,
} from '../features/machine/machineSlice';

export function SelectMachine(props: {
    label: string;
    machine?: IMachine;
    machineSetter?: (machine: IMachine | undefined) => void;
}) {
    const dispatch = useAppDispatch();

    // dependent data sets
    const machineList: IMachine[] = useAppSelector(selectMachineList);

    useEffect(() => {
        dispatch(getMachineList());
    }, [dispatch, machineList]);

    return (
        <FloatingLabel
            controlId="floatingInput-machine"
            label={props.label}
            className="mb-3"
        >
            <Form.Select
                value={props.machine?.machineCode}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    const target = event.target;
                    const value = target.value;
                    const machine = machineList.find(
                        (machine) => machine.machineCode === value,
                    );
                    if (props.machineSetter) {
                        props.machineSetter(machine);
                    }
                }}
            >
                <option value="">[None selected]</option>
                {machineList ? (
                    machineList.map((machine) => {
                        return (
                            <option
                                value={machine.machineCode}
                                key={machine.machineCode}
                            >{`${machine.machineCode} - ${machine.machineDescription}`}</option>
                        );
                    })
                ) : (
                    <>
                        <option value="!">Loading</option>
                    </>
                )}
            </Form.Select>
        </FloatingLabel>
    );
}
