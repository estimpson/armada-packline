import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export enum ApplicationErrorType {
    RemoteTimeout,
    LocalTimeout,
    InvalidPrinterDriver,
    LoginFailed,
    SerialNotFound,
    Unknown,
}

export interface IApplicationErrorState {
    type?: ApplicationErrorType;
    message?: string;
}

const initialState: IApplicationErrorState = {};

export const applicationErrorSlice = createSlice({
    name: 'applicationError',
    initialState,
    reducers: {
        applicationErrorOccurred: (
            state,
            action: PayloadAction<IApplicationErrorState>,
        ) => {
            state.type = action.payload.type;
            state.message = action.payload.message;
        },
        applicationErrorCleared: (state) => {
            state.type = initialState.type;
            state.message = initialState.message;
        },
    },
});

export const { applicationErrorOccurred, applicationErrorCleared } =
    applicationErrorSlice.actions;

export const selectApplicationError = (state: RootState) =>
    state.applicationError;

export default applicationErrorSlice.reducer;
