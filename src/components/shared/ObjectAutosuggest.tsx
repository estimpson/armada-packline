import { Form } from '../../bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import React from 'react';
import './ObjectAutosuggest.css';

export interface IListItem<Type> {
    displayValue: string;
    selectListValue?: string;
    value: Type;
}

type TypeaheadProps = {
    valueList: Array<IListItem<any>>;
    currentValue?: String;
    setter?: (newValue: any | undefined) => void;
};

const FormControlTypeahead = React.forwardRef((props: TypeaheadProps, ref) => {
    return (
        <Typeahead
            id="floatingInputCustom"
            labelKey="displayValue"
            highlightOnlyResult={true}
            options={props.valueList}
            selected={props.valueList.filter(
                (item) => item.displayValue === props.currentValue,
            )}
            onChange={(newValue: any[]) => {
                console.log('Typeahead:onChange');
                console.log(newValue);
                if (props.setter) {
                    if (newValue.length) {
                        props.setter(newValue[0].value);
                    } else {
                        props.setter(undefined);
                    }
                }
            }}
        />
    );
});

export function ObjectAutosuggest<Type>(props: {
    valueList: Array<IListItem<Type>>;
    label: string;
    currentValue?: string;
    setter?: (newValue: Type | undefined) => void;
}) {
    return (
        <Form.Floating className="mb-3">
            <Form.Control
                id={`floatingInput-${props.label}`}
                placeholder={`x`}
                as={FormControlTypeahead}
                valueList={props.valueList}
                currentValue={props.currentValue}
                setter={props.setter}
                onChange={(event: any) => {
                    console.log('Form.Control:onChange');
                    console.log(event);
                }}
            />
            <label htmlFor={`floatingInput-${props.label}`} className="xxx">
                {props.label}
            </label>
        </Form.Floating>
    );
}
