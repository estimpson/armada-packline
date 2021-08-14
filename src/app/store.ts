import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import identityReducer from '../features/identity/identitySlice';

export const store = configureStore({
    reducer: {
        identity: identityReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
