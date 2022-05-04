import identityReducer from '../features/identity/identitySlice';
import applicationErrorReducer from '../features/applicationError/applicationErrorSlice';
import localApiDetailsReducer from '../features/localApi/localApiSlice';
import machineReducer from '../features/machine/machineSlice';
import partReducer from '../features/part/partSlice';
import packingJobReducer from '../features/packingJob/packingJobSlice';

import {
    Action,
    combineReducers,
    configureStore,
    ThunkAction,
} from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import persistReducer from 'redux-persist/es/persistReducer';
import {
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    REHYDRATE,
} from 'redux-persist';
import partialBoxReducer from '../features/partialBox/partialBoxListSlice';

const reducers = combineReducers({
    identity: identityReducer,
    applicationError: applicationErrorReducer,
    localApiDetails: localApiDetailsReducer,
    machineList: machineReducer,
    partList: partReducer,
    packingJob: packingJobReducer,
    partialBoxList: partialBoxReducer,
});
const persistConfig = {
    key: 'root',
    storage,
    blacklist: [
        'applicationError',
        'localApiDetails',
        'machineList',
        'partList',
        'partialBoxList',
    ],
};
const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
