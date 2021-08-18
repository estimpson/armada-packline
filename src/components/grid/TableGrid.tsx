import {
    faPencilAlt,
    faSdCard,
    faUndoAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { FormCheck, FormControl, Table } from 'react-bootstrap';

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
    rowUpdater?(rowOriginal: any, rowModified: any): boolean;
}

export default function TableGrid(props: ITableGridProps) {
    const [rowEditIndex, setRowEditIndex] = useState<number | undefined>(
        undefined,
    );
    const [modifiedRowData, setModifiedRowData] = useState<any | undefined>(
        undefined,
    );
    return (
        <Table striped bordered hover size="sm">
            <thead>
                <tr>
                    {props.select && (
                        <th className="text-center">
                            <FormCheck type="checkbox"></FormCheck>
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
                                    <FormCheck type="checkbox" />
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
                                                        props.rowUpdater &&
                                                        props.rowUpdater(
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
