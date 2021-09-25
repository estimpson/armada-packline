import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { validateLogin } from './identityAPI';

export interface IIdentity {
    userCode: string | null;
    userName: string | null;
}

export interface IIdentityState {
    value: IIdentity;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: IIdentityState = {
    value: {
        userCode: null,
        userName: null,
    },
    status: 'idle',
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const loginAsync = createAsyncThunk(
    'identity/login',
    async (loginInfo: { user: string; password: string }) => {
        const response = await validateLogin(
            loginInfo.user,
            loginInfo.password,
        );

        return response.data;
    },
);

export const identitySlice = createSlice({
    name: 'identity',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        logout: (state) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.value = initialState.value;
        },
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value.userCode = action.payload.userCode;
                state.value.userName = action.payload.userName;
            });
    },
});

export const { logout } = identitySlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectIdentity = (state: RootState): IIdentity =>
    state.identity.value;
// export const selectIdentity = (state: RootState) => state.identity;

export default identitySlice.reducer;
