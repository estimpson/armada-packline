import { Button, Offcanvas } from '../../bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
    applicationNoticeCleared,
    ApplicationNoticeType,
    IApplicationNoticeState,
    selectApplicationNotice,
} from '../../features/applicationNotice/applicationNoticeSlice';
import { createAction } from '@reduxjs/toolkit';
import {
    resetPackingJobInventoryAsync,
    setJobIsDoneFlag,
    setShelfInventoryFlag,
} from '../../features/packingJob/packingJobSlice';
import { Container } from 'react-bootstrap';

export function ApplicationNotification() {
    const applicationNotice: IApplicationNoticeState = useAppSelector(
        selectApplicationNotice,
    );
    const dispatch = useAppDispatch();

    console.log(applicationNotice);
    return (
        <Offcanvas
            show={applicationNotice.type}
            placement={'bottom'}
            onHide={() => dispatch(applicationNoticeCleared())}
            backdropClassName={'offcanvas-backdrop'}
        >
            <Offcanvas.Header
                className={`${
                    applicationNotice.type === ApplicationNoticeType.Success
                        ? 'text-white bg-success'
                        : ''
                }${
                    applicationNotice.type === ApplicationNoticeType.Warning
                        ? 'text-dark bg-warning'
                        : ''
                }${
                    applicationNotice.type === ApplicationNoticeType.Info
                        ? 'text-dark bg-info'
                        : ''
                }${
                    applicationNotice.type === ApplicationNoticeType.Danger
                        ? 'text-white bg-danger'
                        : ''
                }${
                    applicationNotice.type === ApplicationNoticeType.Unknown
                        ? 'text-dark bg-light'
                        : ''
                }`}
                closeButton
            >
                <Offcanvas.Title>Fx Pack Line</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="danger">
                <p>{applicationNotice.message}</p>
                {/* Refactor this to dynamic code */}
                <Container
                    fluid
                    className="d-flex flex-row justify-content-end"
                >
                    <Button
                        className="me-3"
                        onClick={() => {
                            switch (applicationNotice.conditionalActionName) {
                                case resetPackingJobInventoryAsync.toString():
                                    dispatch(resetPackingJobInventoryAsync());
                                    dispatch(applicationNoticeCleared());
                                    break;
                                case setShelfInventoryFlag.toString():
                                    dispatch(
                                        setShelfInventoryFlag(
                                            applicationNotice.conditionalActionPayload,
                                        ),
                                    );
                                    dispatch(applicationNoticeCleared());
                                    break;
                                case setJobIsDoneFlag.toString():
                                    dispatch(
                                        setJobIsDoneFlag(
                                            applicationNotice.conditionalActionPayload,
                                        ),
                                    );
                                    dispatch(applicationNoticeCleared());
                                    break;
                            }
                        }}
                    >
                        Ok
                    </Button>
                    <Button
                        onClick={() => {
                            dispatch(applicationNoticeCleared());
                        }}
                    >
                        Cancel
                    </Button>
                </Container>
            </Offcanvas.Body>
        </Offcanvas>
    );
}
