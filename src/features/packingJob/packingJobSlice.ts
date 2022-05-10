import {
    createAction,
    createAsyncThunk,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { RootState } from '../../app/store';
import { IApplicationErrorState } from '../applicationError/applicationErrorSlice';
import { IIdentityState } from '../identity/identitySlice';
import { ILocalApiState } from '../localApi/localApiSlice';
import { IMachine, IMachineListState } from '../machine/machineSlice';
import { IPart, IPartListState } from '../part/partSlice';
import { IPartPackaging } from '../partPackaging/partPackagingSlice';
import {
    cancelPackingJob,
    generatePackingJobInventory,
    getPackingJob,
    openPackingJob,
    resetPackingJobInventory,
} from './packingJobAPI';

function clamp(
    target: number,
    min: number | undefined,
    max: number | undefined,
) {
    return typeof min === 'number' && target < min
        ? min
        : typeof max === 'number' && target > max
        ? max
        : target;
}

export interface IPackingCombinedObject {
    serial: number;
    quantityOriginal: number;
    quantityUsed: number;
    quantityRemaining: number;
}

export interface IPackingObject {
    serial: number;
    part: IPart;
    quantity: number;
    partial: boolean;
    printed: boolean;
    combinedObjects?: IPackingCombinedObject[];
}

export interface IPackingJob {
    demoJob: boolean;
    part?: IPart;
    packaging?: IPartPackaging;
    acknowledged?: boolean;
    quantity?: number;
    pieceWeight?: number;
    validPieceWeight?: boolean;
    pieceWeightDiscrepancyNote?: string;
    overridePieceWeight?: boolean;
    operator?: string;
    machine?: IMachine;
    jobInProgress?: boolean;
    boxes?: number;
    partialBoxQuantity?: number;
    objectList?: IPackingObject[];
    jobIsDoneFlag?: boolean;
    shelfInventoryFlag?: boolean;
    packingJobNumber?: string;
}

export interface IPackagingJobState {
    value: IPackingJob;
    status: 'idle' | 'loading' | 'failed';
    error: string | null | undefined;
}

const initialState: IPackagingJobState = {
    value: { demoJob: false },
    status: 'idle',
    error: null,
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const SetError = createAction<IApplicationErrorState>(
    'applicationError/applicationErrorOccurred',
);

export const generatePackingJobInventoryAsync = createAsyncThunk(
    'packingJob/generatePackingJobInventory',
    async (_: void, { dispatch, getState }) => {
        const { localApiDetails, identity, packingJob } = getState() as {
            localApiDetails: ILocalApiState;
            identity: IIdentityState;
            packingJob: IPackagingJobState;
        };

        // Action defined in packingJobAPI
        const response = await generatePackingJobInventory(
            localApiDetails,
            identity.value,
            packingJob.value,
            dispatch,
            SetError,
        );

        return response.data;
    },
);

export const resetPackingJobInventoryAsync = createAsyncThunk(
    'packingJob/resetPackingJobInventory',
    async (_: void, { dispatch, getState }) => {
        const { localApiDetails, identity, packingJob } = getState() as {
            localApiDetails: ILocalApiState;
            identity: IIdentityState;
            packingJob: IPackagingJobState;
        };

        // Action defined in packingJobAPI
        const response = await resetPackingJobInventory(
            localApiDetails,
            identity.value,
            packingJob.value,
            dispatch,
            SetError,
        );

        return;
    },
);

export const openPackingJobAsync = createAsyncThunk(
    'packingJob/openPackingJob',
    async (_: void, { dispatch, getState }) => {
        const { localApiDetails, identity, packingJob } = getState() as {
            localApiDetails: ILocalApiState;
            identity: IIdentityState;
            packingJob: IPackagingJobState;
        };

        // Action defined in packingJobAPI
        const response = await openPackingJob(
            localApiDetails,
            identity.value,
            packingJob.value,
            dispatch,
            SetError,
        );

        return response.data;
    },
);

export const cancelPackingJobAsync = createAsyncThunk(
    'packingJob/cancelPackingJob',
    async (_: void, { dispatch, getState }) => {
        const { localApiDetails, identity, packingJob } = getState() as {
            localApiDetails: ILocalApiState;
            identity: IIdentityState;
            packingJob: IPackagingJobState;
        };

        // Action defined in packingJobAPI
        await cancelPackingJob(
            localApiDetails,
            identity.value,
            packingJob.value,
            dispatch,
            SetError,
        );
    },
);

interface ValidationErrors {
    errorMessage: string;
    field_errors: Record<string, string>;
}

export const getPackingJobAsync = createAsyncThunk<IPackingJob, void>(
    'packingJob/getPackingJob',
    async (_: void, { dispatch, getState, rejectWithValue }) => {
        const { localApiDetails, identity, packingJob, partList, machineList } =
            getState() as {
                localApiDetails: ILocalApiState;
                identity: IIdentityState;
                packingJob: IPackagingJobState;
                partList: IPartListState;
                machineList: IMachineListState;
            };

        // Action definied in packingJobAPI
        try {
            const response = await getPackingJob(
                localApiDetails,
                identity.value,
                packingJob.value,
                partList.value,
                machineList.value,
                dispatch,
                SetError,
            );

            return response.data;
        } catch (err: any) {
            let error: AxiosError<ValidationErrors> = err; // cast the error for access to response
            if (!error.response) {
                throw err;
            }
            return rejectWithValue(error.response.data);
        }
    },
);

// A function that accepts an initial state, an object full of reducer functions,
// and a "slice name", and automatically generates action creators and action types
// that correspond to the reducers and state.
export const packingJobSlice = createSlice({
    name: 'packagingJob',
    initialState,
    reducers: {
        newJob: (state) => {
            state = initialState;
        },
        setPart: (state, action: PayloadAction<IPart | undefined>) => {
            // pre-modification state validation
            if (state.value.objectList)
                throw new Error(
                    'Changing parts on a job forbidden when that job has associated' +
                        ' inventory.  Delete all inventory first or start a new job.',
                );
            if (state.value.jobInProgress)
                throw new Error(
                    'Changing parts on a job forbidden when that job has started.  ' +
                        'Stop job first.',
                );

            // part has changed, reset all other properties
            state.value.part = action.payload;
            state.value.packaging = undefined;
            state.value.acknowledged = false;
            state.value.pieceWeight = undefined;
            state.value.quantity = undefined;
            state.value.boxes = undefined;
            state.value.partialBoxQuantity = undefined;
            state.value.operator = undefined;
            state.value.machine = undefined;

            if (action.payload?.packagingList.length === 1) {
                state.value.packaging = action.payload?.packagingList[0];
            }
        },
        setPackaging: (
            state,
            action: PayloadAction<IPartPackaging | undefined>,
        ) => {
            // pre-modification state validation
            if (state.value.objectList)
                throw new Error(
                    'Changing packaging on a job forbidden when that job has associated' +
                        ' inventory.  Delete all inventory first or start a new job.',
                );
            if (state.value.jobInProgress)
                throw new Error(
                    'Changing packaging on a job forbidden when that job has started.  ' +
                        'Stop job first.',
                );

            state.value.packaging = action.payload;
            state.value.acknowledged = false;
            state.value.boxes = undefined;
            state.value.partialBoxQuantity = undefined;
        },
        setAcknowledged: (state, action: PayloadAction<boolean>) => {
            state.value.acknowledged = action.payload;
        },
        setPieceWeightQuantity: (
            state,
            action: PayloadAction<number | undefined>,
        ) => {
            if (!action.payload) {
                state.value.quantity = undefined;
                return;
            }

            if (!Number.isInteger(action.payload))
                throw new Error('Piece weight quantity must be a whole number');
            if (action.payload < 0)
                throw new Error(
                    'Piece weight quantity must be greater than zero',
                );
            state.value.quantity = action.payload;
        },
        setPieceWeight: (state, action: PayloadAction<number | undefined>) => {
            if (!action.payload) {
                state.value.validPieceWeight = false;
                state.value.pieceWeight = undefined;
                return;
            }

            if (action.payload < 0)
                throw new Error('Piece weight must be greater than zero');
            state.value.pieceWeight = action.payload;

            const pieceWeightError =
                state.value.part?.unitWeight &&
                state.value.part?.weightTolerance &&
                (action.payload - state.value.part.unitWeight) /
                    state.value.part.unitWeight;

            const valid =
                pieceWeightError !== undefined &&
                state.value.part?.weightTolerance !== undefined &&
                Math.abs(pieceWeightError) <= state.value.part.weightTolerance;

            state.value.validPieceWeight = valid;
            state.value.pieceWeightDiscrepancyNote = '';
            state.value.overridePieceWeight = false;
        },
        setPieceWeightDiscrepancyNote: (
            state,
            action: PayloadAction<string>,
        ) => {
            state.value.pieceWeightDiscrepancyNote = action.payload;
            state.value.overridePieceWeight = false;
        },
        overridePieceWeight: (state) => {
            state.value.overridePieceWeight = true;
        },
        setOperator: (state, action: PayloadAction<string>) => {
            state.value.operator = action.payload;
        },
        setMachine: (state, action: PayloadAction<IMachine | undefined>) => {
            state.value.machine = action.payload;
        },
        setBoxes: (state, action: PayloadAction<number>) => {
            if (action.payload > 0) {
                state.value.boxes = action.payload;
            } else {
                state.value.boxes = undefined;
            }
        },
        setPartialBoxQuantity: (state, action: PayloadAction<number>) => {
            if (action.payload > 0) {
                state.value.partialBoxQuantity = action.payload;
            } else {
                state.value.partialBoxQuantity = undefined;
            }
        },
        deleteBox: (state, action: PayloadAction<number>) => {
            state.value.objectList = state.value.objectList!.filter(
                (object) => object.serial !== action.payload,
            );
            state.value.boxes = state.value.objectList!.filter(
                (object) =>
                    object.quantity === state.value.packaging!.standardPack,
            ).length;
            state.value.boxes = state.value.boxes
                ? state.value.boxes
                : undefined;
            state.value.partialBoxQuantity = state.value.objectList!.find(
                (object) =>
                    object.quantity !== state.value.packaging!.standardPack,
            )?.quantity;
        },
        printLabels: (state) => {
            state.value.objectList?.forEach((object) => {
                object.printed = true;
            });
        },
        combinePartialBox: (state, action: PayloadAction<string>) => {
            if (state.value.partialBoxQuantity) {
                let partialIndex = state.value.objectList!.length - 1;
                state.value.objectList![partialIndex].combinedObjects =
                    state.value.objectList![partialIndex].combinedObjects ||
                    new Array<IPackingCombinedObject>(0);
                if (action.payload === 'S3521477') {
                    let quantityToUse = clamp(
                        state.value.packaging!.standardPack -
                            state.value.partialBoxQuantity,
                        0,
                        35,
                    );
                    let combinedObject: IPackingCombinedObject = {
                        serial: 3521477,
                        quantityOriginal: 35,
                        quantityRemaining: 35 - quantityToUse,
                        quantityUsed: quantityToUse,
                    };
                    state.value.objectList![partialIndex].combinedObjects!.push(
                        combinedObject,
                    );
                    state.value.objectList![partialIndex].quantity +=
                        quantityToUse;
                }
            }
        },
        setJobIsDoneFlag: (
            state,
            action: PayloadAction<boolean | undefined>,
        ) => {
            state.value.jobIsDoneFlag = action.payload;
        },
        setShelfInventoryFlag: (
            state,
            action: PayloadAction<boolean | undefined>,
        ) => {
            state.value.shelfInventoryFlag = action.payload;
        },
        completeJob: (state) => {
            state.value = initialState.value;
        },
        //todo: error checking
        //can't edit job with inventory
        //can't delete box after combine
        //todo: notification on async tasks
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: (builder) => {
        builder
            .addCase(resetPackingJobInventoryAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(
                resetPackingJobInventoryAsync.fulfilled,
                (state, _action) => {
                    state.status = 'idle';
                    state.value.objectList = undefined;
                },
            )

            .addCase(generatePackingJobInventoryAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(
                generatePackingJobInventoryAsync.fulfilled,
                (state, action) => {
                    state.status = 'idle';
                    state.value.objectList = action.payload;
                },
            )

            .addCase(openPackingJobAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(openPackingJobAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value.jobInProgress = true;
                state.value.packingJobNumber = action.payload.packingJobNumber;
            })

            .addCase(cancelPackingJobAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(cancelPackingJobAsync.fulfilled, (state, _action) => {
                state.status = 'idle';
                state.value.packingJobNumber = undefined;
                state.value.jobInProgress = false;
            })

            .addCase(getPackingJobAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getPackingJobAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value = action.payload;
            })
            .addCase(getPackingJobAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    // Being that we passed in Validationerrors to rejectType in `createAsyncThunk`, the payload will be available here.
                    // state.error = action.payload.errorMessage;
                    console.log(action.payload);
                } else {
                    state.error = action.error.message;
                }
            });
    },
});

export const {
    newJob,
    setPart,
    setPackaging,
    setAcknowledged,
    setPieceWeightQuantity,
    setPieceWeight,
    setPieceWeightDiscrepancyNote,
    overridePieceWeight,
    setOperator,
    setMachine,
    setBoxes,
    setPartialBoxQuantity,
    deleteBox,
    printLabels,
    combinePartialBox,
    setJobIsDoneFlag,
    setShelfInventoryFlag,
    completeJob,
} = packingJobSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectPackingJob = (state: RootState): IPackingJob =>
    state.packingJob.value;
// export const selectIdentity = (state: RootState) => state.identity;

export default packingJobSlice.reducer;
