import { AsyncThunkAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export enum ApplicationNoticeType {
    Success,
    Warning,
    Info,
    Danger,
    Unknown,
}

export enum PromptType {
    YesNo,
    YesNoCancel,
    OkCancel,
    Ok,
}

export interface IApplicationNoticeState {
    type?: ApplicationNoticeType;
    promptType?: PromptType;
    message?: string;
    conditionalActionName?: string;
    conditionalActionPayload?: any;
}

const initialState: IApplicationNoticeState = {};

export const applicationNoticeSlice = createSlice({
    name: 'applicationNotice',
    initialState,
    reducers: {
        applicationNoticeOccurred: (
            state,
            action: PayloadAction<IApplicationNoticeState>,
        ) => {
            return { ...action.payload };
        },
        applicationNoticeCleared: (state) => {
            return { ...initialState };
        },
    },
});

export const { applicationNoticeOccurred, applicationNoticeCleared } =
    applicationNoticeSlice.actions;

export const selectApplicationNotice = (state: RootState) =>
    state.applicationNotice;

export default applicationNoticeSlice.reducer;
