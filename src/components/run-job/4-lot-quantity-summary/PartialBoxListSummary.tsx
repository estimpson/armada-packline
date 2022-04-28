import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../app/hooks';
import {
    getPartialBoxListAsync,
    selectPartialBoxList,
} from '../../../features/partialBox/partialBoxListSlice';
import TableGrid from '../../shared/TableGrid';
import { Card, Col, Form, Row } from '../../../bootstrap';

export function PartialBoxListSummary(props: { partCode: string }) {
    const dispatch = useAppDispatch();

    const partialBoxes = useSelector(selectPartialBoxList);

    useEffect(() => {
        dispatch(getPartialBoxListAsync(props.partCode));
    }, [dispatch, props.partCode]);

    return (
        <>
            {partialBoxes.length ? (
                <>
                    {partialBoxes.map((partialBox) => {
                        return (
                            <>
                                <Card>
                                    <Card.Body className="p-2">
                                        <p className="m-0 form-label">
                                            Serial:
                                        </p>
                                        <p className="m-0">
                                            {partialBox.serial}
                                        </p>
                                        <p className="m-0 form-label">Qty:</p>
                                        <p className="m-0">
                                            {partialBox.quantity.toLocaleString()}
                                        </p>
                                        <p className="m-0 form-label">Pkg:</p>
                                        <p className="m-0">
                                            {partialBox.packageType}
                                        </p>
                                        {partialBox.notes && (
                                            <>
                                                <p className="m-0 form-label">
                                                    Notes:
                                                </p>
                                                <p className="m-0">
                                                    {partialBox.notes}
                                                </p>
                                            </>
                                        )}
                                        <p className="m-0 form-label">
                                            LastDate:
                                        </p>
                                        <p className="m-0">
                                            {new Date(
                                                partialBox.lastDate,
                                            ).toLocaleDateString()}
                                        </p>
                                    </Card.Body>
                                </Card>
                            </>
                        );
                    })}
                </>
            ) : (
                <>
                    <p>None available</p>
                </>
            )}
        </>
    );
}
