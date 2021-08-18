import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import React from 'react';
import { useState } from 'react';

type SelectMenuProps = {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    labeledBy?: string;
};

const SelectMenu = React.forwardRef(
    (props: SelectMenuProps, ref: React.Ref<HTMLDivElement>) => {
        return (
            <Container>
                <div
                    ref={ref}
                    style={props.style}
                    className={props.className + ' select-menu'}
                    aria-labelledby={props.labeledBy}
                >
                    <ul className="list-unstyled">
                        {React.Children.toArray(props.children)}
                    </ul>
                </div>
            </Container>
        );
    },
);

interface IFormInputSelectProps {
    controlId: string;
    label: string;
    values: string[];
    selectionHandler?: any;
}

export default function FormInputSelect(props: IFormInputSelectProps) {
    const [filterText, setFilterText] = useState<string | null>('');
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleState = () => setShowDropdown(!showDropdown);

    return (
        <Form.Group as={Row} className="mb-3" controlId={props.controlId}>
            <Form.Label column sm="6" md="4" lg="2">
                {props.label}
            </Form.Label>
            <Col sm="12" md="8" lg="4">
                <InputGroup>
                    <FormControl
                        aria-label="Text input with dropdown button"
                        autoComplete="off"
                        onFocus={() => setShowDropdown(true)}
                        onChange={(event) => {
                            setFilterText(event.target.value);
                        }}
                        value={
                            filterText
                                ? filterText
                                : selectedKey
                                ? selectedKey
                                : ''
                        }
                    />

                    <Dropdown
                        id="input-group-dropdown-2"
                        align="end"
                        autoClose={false}
                        show={showDropdown}
                        onSelect={(e: string | null) => {
                            setShowDropdown(false);
                            setFilterText('');
                            setSelectedKey(e);
                            props.selectionHandler(e);
                        }}
                    >
                        <Dropdown.Toggle
                            variant="outline-secondary"
                            id="dropdown-basic"
                            onClick={() => toggleState()}
                        ></Dropdown.Toggle>
                        <Dropdown.Menu as={SelectMenu}>
                            <Container>
                                {props.values
                                    .filter(
                                        (value: string) =>
                                            !filterText ||
                                            value
                                                .toLowerCase()
                                                .includes(
                                                    filterText.toLowerCase(),
                                                ),
                                    )
                                    .map((value: string) => {
                                        return (
                                            <Dropdown.Item
                                                key={value}
                                                eventKey={value}
                                                onSelect={(e) => {
                                                    console.log(e);
                                                    props.selectionHandler(e);
                                                }}
                                                onClick={(e) => {
                                                    console.log(e);
                                                    props.selectionHandler(e);
                                                }}
                                            >
                                                {value}
                                            </Dropdown.Item>
                                        );
                                    })}
                                <Dropdown.Divider />
                                <Dropdown.Item href="#">
                                    {filterText}
                                </Dropdown.Item>
                            </Container>
                        </Dropdown.Menu>
                    </Dropdown>
                </InputGroup>
            </Col>
        </Form.Group>
    );
}
