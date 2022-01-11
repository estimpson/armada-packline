import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../app/hooks';
import {
    getPartialBoxListAsync,
    selectPartialBoxList,
} from '../../../features/partialBox/partialBoxListSlice';
import TableGrid from '../../shared/TableGrid';

export function PartialBoxList(props: { partCode: string }) {
    const dispatch = useAppDispatch();

    const partialBoxes = useSelector(selectPartialBoxList);

    useEffect(() => {
        dispatch(getPartialBoxListAsync(props.partCode));
    }, [dispatch, props.partCode]);

    return (
        <>
            <h6>Available Partials</h6>
            {partialBoxes ? (
                <TableGrid
                    columns={[
                        {
                            columnName: 'serial',
                            columnHeader: 'Serial',
                            readonly: true,
                        },
                        {
                            columnName: 'packageType',
                            columnHeader: 'Package Type',
                            readonly: true,
                        },
                        {
                            columnName: 'quantity',
                            columnHeader: 'Quantity',
                            readonly: true,
                        },
                        {
                            columnName: 'notes',
                            columnHeader: 'Notes',
                            readonly: true,
                        },
                        {
                            columnName: 'lastDate',
                            columnHeader: 'Last Date',
                            readonly: true,
                        },
                    ]}
                    data={partialBoxes.map((partialBox) => {
                        return {
                            serial: partialBox.serial,
                            packageType: partialBox.packageType,
                            quantity: partialBox.quantity,
                            notes: partialBox.notes,
                            lastDate: new Date(
                                partialBox.lastDate,
                            ).toLocaleDateString(),
                        };
                    })}
                />
            ) : (
                <>
                    <p>None available</p>
                </>
            )}
        </>
    );
}
