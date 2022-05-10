import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface ILocalApiState {
    port?: string;
    signingKey?: string;
}

const initialState: ILocalApiState = { port: '', signingKey: 'devKey' };

export const localApiSlice = createSlice({
    name: 'localApi',
    initialState,
    reducers: {
        localApiInitialized: (state, action: PayloadAction<ILocalApiState>) => {
            state.port = action.payload.port;
            state.signingKey = action.payload.signingKey;
        },
    },
});

export const { localApiInitialized } = localApiSlice.actions;

export const selectApiDetails = (state: RootState) => state.localApiDetails;

export default localApiSlice.reducer;
