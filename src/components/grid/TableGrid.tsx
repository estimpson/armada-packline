import {
    faCheck,
    faCheckDouble,
    faCheckSquare,
    faPencilAlt,
    faSdCard,
    faSquare,
    faUndoAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { FormControl, Table } from 'react-bootstrap';
import { IPreObject } from '../../data/PreObjectList';

export interface ITableGridColumnProps {
    columnName: string;
    columnHeader?: string;
    readonly?: boolean;
}

export interface ITableGridProps {
    striped?: boolean;
    select?: boolean;
    editableRows?: boolean;
    columns: Array<ITableGridColumnProps>;
    data: Array<any>;
    rowUpdateHandler?(rowOriginal: any, rowModified: any): boolean;
    rowSelectHandler?(selectedRows: Array<any>): void;
}

export default function TableGrid(props: ITableGridProps) {
    const [prevData, setPrevData] = useState<Array<IPreObject> | undefined>(
        undefined,
    );
    const [rowEditIndex, setRowEditIndex] = useState<number | undefined>(
        undefined,
    );
    const [modifiedRowData, setModifiedRowData] = useState<any | undefined>(
        undefined,
    );
    const [selectedRowIndexes, setSelectedRowIndexes] = useState<
        Array<boolean>
    >([]);

    if (props.data !== prevData) {
        // Data has changed so reset the editing and row selection.
        setRowEditIndex(undefined);
        setModifiedRowData(undefined);
        setSelectedRowIndexes(Array(props.data.length).fill(false));
        setPrevData(props.data);
    }

    const selectedState = (selectedRowIndexes: Array<boolean>) => {
        const selectedRowCount = selectedRowIndexes.filter((row) => row).length;
        return selectedRowCount === 0
            ? 'none'
            : selectedRowCount === props.data.length
            ? 'all'
            : 'partial';
    };
    const selectedStateIcon = (selectedRowIndexes: Array<boolean>) => {
        let state = selectedState(selectedRowIndexes);
        return state === 'none'
            ? faSquare
            : state === 'all'
            ? faCheckDouble
            : faCheckSquare;
    };

    return (
        <Table striped bordered hover size="sm">
            <thead>
                <tr>
                    {props.select && (
                        <th className="text-center">
                            <FontAwesomeIcon
                                icon={selectedStateIcon(selectedRowIndexes)}
                                onClick={() => {
                                    const state =
                                        selectedState(selectedRowIndexes);
                                    const a = Array(props.data.length);
                                    if (state === 'all') {
                                        setSelectedRowIndexes(a.fill(false));
                                    } else {
                                        setSelectedRowIndexes(a.fill(true));
                                    }
                                    if (props.rowSelectHandler) {
                                        const selectedRows = props.data.filter(
                                            (row, rowindex) => a[rowindex],
                                        );
                                        props.rowSelectHandler(selectedRows);
                                    }
                                }}
                            />
                        </th>
                    )}
                    {props.columns.map((column) => {
                        return (
                            <th>
                                {column.columnHeader
                                    ? column.columnHeader
                                    : column.columnName}
                            </th>
                        );
                    })}
                    {props.editableRows && <th></th>}
                </tr>
            </thead>
            <tbody>
                {props.data &&
                    props.data.map((row, rowIndex) => (
                        <tr>
                            {props.select && (
                                <td className="text-center">
                                    <FontAwesomeIcon
                                        icon={
                                            selectedRowIndexes[rowIndex]
                                                ? faCheck
                                                : faSquare
                                        }
                                        onClick={() => {
                                            const a = Array(
                                                props.data.length,
                                            ).fill(false);
                                            for (
                                                let index = 0;
                                                index < a.length;
                                                index++
                                            ) {
                                                a[index] =
                                                    selectedRowIndexes[index];
                                            }
                                            a[rowIndex] = !a[rowIndex];
                                            setSelectedRowIndexes(a);
                                            if (props.rowSelectHandler) {
                                                const selectedRows =
                                                    props.data.filter(
                                                        (row, rowindex) =>
                                                            a[rowindex],
                                                    );
                                                props.rowSelectHandler(
                                                    selectedRows,
                                                );
                                            }
                                        }}
                                    />
                                </td>
                            )}
                            {props.columns.map((column) => (
                                <td>
                                    {rowIndex === rowEditIndex &&
                                    !column.readonly ? (
                                        <FormControl
                                            className="p-0"
                                            defaultValue={
                                                row[column.columnName]
                                            }
                                            onChange={(event) => {
                                                modifiedRowData[
                                                    column.columnName
                                                ] = event.target.value;
                                                setModifiedRowData(
                                                    modifiedRowData,
                                                );
                                            }}
                                        />
                                    ) : (
                                        row[column.columnName]
                                    )}
                                </td>
                            ))}
                            {props.editableRows && (
                                <td className="text-center">
                                    {rowIndex === rowEditIndex ? (
                                        <>
                                            <FontAwesomeIcon
                                                size="sm"
                                                icon={faSdCard}
                                                className="mx-2"
                                                onClick={() => {
                                                    if (
                                                        props.rowUpdateHandler &&
                                                        props.rowUpdateHandler(
                                                            row,
                                                            modifiedRowData,
                                                        )
                                                    ) {
                                                        setModifiedRowData(
                                                            undefined,
                                                        );
                                                        setRowEditIndex(
                                                            undefined,
                                                        );
                                                    }
                                                }}
                                            />
                                            <FontAwesomeIcon
                                                size="sm"
                                                icon={faUndoAlt}
                                                className="mx-2"
                                                onClick={() => {
                                                    setModifiedRowData(
                                                        undefined,
                                                    );
                                                    setRowEditIndex(undefined);
                                                }}
                                            />
                                        </>
                                    ) : (
                                        <FontAwesomeIcon
                                            icon={faPencilAlt}
                                            size="sm"
                                            className="mx-2"
                                            onClick={() => {
                                                setModifiedRowData(row);
                                                setRowEditIndex(rowIndex);
                                            }}
                                        />
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
            </tbody>
        </Table>
    );
}
