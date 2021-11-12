import { FloatingLabel, Form } from '../../bootstrap';

export interface IListItem<Type> {
    displayValue: string;
    selectListValue?: string;
    value: Type;
}

export function ObjectSelect<Type>(props: {
    valueList: Array<IListItem<Type>>;
    label: string;
    currentValue?: string;
    setter?: (newValue: Type | undefined) => void;
}) {
    return (
        <FloatingLabel
            controlId={`floatingInput-${props.label}`}
            label={props.label}
            className="mb-3"
        >
            <Form.Select
                value={
                    props.valueList.find(
                        (listItem) =>
                            listItem.displayValue === props.currentValue,
                    )?.displayValue ?? ''
                }
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    const target = event.target;
                    const value = target.value;
                    const newValue = props.valueList.find(
                        (listItem) => listItem.displayValue === value,
                    )?.value;
                    if (props.setter) {
                        props.setter(newValue);
                    }
                }}
            >
                <option value="">[None selected]</option>
                {props.valueList ? (
                    props.valueList.map((listItem) => {
                        return (
                            <option
                                value={listItem.displayValue}
                                key={listItem.displayValue}
                            >
                                {listItem.selectListValue ??
                                    listItem.displayValue}
                            </option>
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
