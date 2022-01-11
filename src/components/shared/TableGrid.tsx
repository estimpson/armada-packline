import {
    faCheck,
    faCheckDouble,
    faCheckSquare,
    faCircle,
    faDotCircle,
    faPencilAlt,
    faSdCard,
    faSquare,
    faUndoAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { FormControl, Table } from 'react-bootstrap';

export interface ITableGridColumnProps {
    columnName: string;
    columnHeader?: string;
    readonly?: boolean;
}

export interface ITableGridProps {
    striped?: boolean;
    singleRowSelect?: boolean;
    multiRowCheckboxSelect?: boolean;
    editableRows?: boolean;
    columns: Array<ITableGridColumnProps>;
    data: Array<any>;
    singleSelectedRow?: any;
    rowUpdateHandler?(rowOriginal: any, rowModified: any): boolean;
    multirowSelectionHandler?(selectedRows: Array<any>): void;
    rowSelectionHandler?(selectedRow: any): void;
}

export default function TableGrid(props: ITableGridProps) {
    const [prevData, setPrevData] = useState<Array<any> | undefined>(undefined);
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
        <Table striped={props.striped} bordered hover size="sm">
            <thead>
                <tr>
                    {props.singleRowSelect && <th></th>}
                    {props.multiRowCheckboxSelect && (
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
                                    if (props.multirowSelectionHandler) {
                                        const selectedRows = props.data.filter(
                                            (row, rowindex) => a[rowindex],
                                        );
                                        props.multirowSelectionHandler(
                                            selectedRows,
                                        );
                                    }
                                }}
                            />
                        </th>
                    )}
                    {props.columns.map((column) => {
                        return (
                            <th key={column.columnName}>
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
                        <tr key={rowIndex}>
                            {props.singleRowSelect && (
                                <td className="text-center">
                                    <FontAwesomeIcon
                                        icon={
                                            row === props.singleSelectedRow
                                                ? faDotCircle
                                                : faCircle
                                        }
                                        fixedWidth
                                        onClick={() => {
                                            if (props.rowSelectionHandler) {
                                                props.rowSelectionHandler(row);
                                            }
                                        }}
                                    />
                                </td>
                            )}
                            {props.multiRowCheckboxSelect && (
                                <td className="text-center">
                                    <FontAwesomeIcon
                                        icon={
                                            selectedRowIndexes[rowIndex]
                                                ? faCheck
                                                : faSquare
                                        }
                                        fixedWidth
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
                                            if (
                                                props.multirowSelectionHandler
                                            ) {
                                                const selectedRows =
                                                    props.data.filter(
                                                        (row, rowindex) =>
                                                            a[rowindex],
                                                    );
                                                props.multirowSelectionHandler(
                                                    selectedRows,
                                                );
                                            }
                                        }}
                                    />
                                </td>
                            )}
                            {props.columns.map((column) => (
                                <td key={column.columnName}>
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
                                                icon={faSdCard}
                                                fixedWidth
                                                size="sm"
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
                                                icon={faUndoAlt}
                                                fixedWidth
                                                size="sm"
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
                                            fixedWidth
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
