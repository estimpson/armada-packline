import identityReducer from '../features/identity/identitySlice';
import applicationErrorReducer from '../features/applicationError/applicationErrorSlice';
import applicationNoticeReducer from '../features/applicationNotice/applicationNoticeSlice';
import localApiDetailsReducer from '../features/localApi/localApiSlice';
import barcodeScannerReducer from '../features/barcodeScanner/barcodeScannerSlice';
import machineReducer from '../features/machine/machineSlice';
import partReducer from '../features/part/partSlice';
import packingJobReducer from '../features/packingJob/packingJobSlice';
import partialBoxReducer from '../features/partialBox/partialBoxListSlice';
import recentPieceWeightReducer from '../features/recentPieceWeight/recentPieceWeightSlice';

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

const reducers = combineReducers({
    identity: identityReducer,
    applicationError: applicationErrorReducer,
    applicationNotice: applicationNoticeReducer,
    localApiDetails: localApiDetailsReducer,
    scannerData: barcodeScannerReducer,
    machineList: machineReducer,
    partList: partReducer,
    packingJob: packingJobReducer,
    partialBoxList: partialBoxReducer,
    recentPieceWeightList: recentPieceWeightReducer,
});
const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['identity', 'applicationError', 'localApiDetails'],
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
