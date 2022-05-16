import { useSelector } from 'react-redux';
import { selectPartialBoxList } from '../../../features/partialBox/partialBoxListSlice';
import TableGrid from '../../shared/TableGrid';

export function PartialBoxList(props: { partCode: string }) {
    const partialBoxes = useSelector(selectPartialBoxList);

    return (
        <>
            <h6>Available Partials</h6>
            {partialBoxes.length ? (
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
