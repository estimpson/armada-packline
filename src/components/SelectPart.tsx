import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { FloatingLabel, Form, Row } from '../bootstrap';
import { getPartList, IPart, selectPartList } from '../features/part/partSlice';

export function SelectPart(props: {
    part?: IPart;
    partSetter?: (part: IPart | undefined) => void;
}) {
    const dispatch = useAppDispatch();

    // dependent data sets
    const partList: IPart[] = useAppSelector(selectPartList);

    useEffect(() => {
        dispatch(getPartList());
    }, [dispatch, partList]);

    return (
        <FloatingLabel
            controlId="floatingInput-part"
            label="Select Part"
            className="mb-3"
        >
            <Form.Select
                value={props.part?.partCode}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    const target = event.target;
                    const value = target.value;
                    const part = partList.find(
                        (part) => part.partCode === value,
                    );
                    if (props.partSetter) {
                        props.partSetter(part);
                    }
                }}
            >
                <option value="">[None selected]</option>
                {partList ? (
                    partList.map((part) => {
                        return (
                            <option
                                value={part.partCode}
                                key={part.partCode}
                            >{`${part.partCode} - ${part.partDescription} # ${
                                part.unitWeight
                            } +/- ${
                                part.unitWeight * part.weightTolerance
                            }`}</option>
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
