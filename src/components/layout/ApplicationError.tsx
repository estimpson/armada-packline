import { Offcanvas } from '../../bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
    applicationErrorCleared,
    IApplicationErrorState,
    selectApplicationError,
} from '../../features/applicationError/applicationErrorSlice';

export function ApplicationError() {
    const applicationError: IApplicationErrorState = useAppSelector(
        selectApplicationError,
    );
    const dispatch = useAppDispatch();

    return (
        <Offcanvas
            show={applicationError.type}
            placement={'bottom'}
            onHide={() => dispatch(applicationErrorCleared())}
            backdropClassName={'offcanvas-backdrop'}
        >
            <Offcanvas.Header className="text-light bg-danger" closeButton>
                <Offcanvas.Title>Aztec Supplier Portal</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="danger">
                <p className="danger text-danger">{applicationError.message}</p>
            </Offcanvas.Body>
        </Offcanvas>
    );
}
