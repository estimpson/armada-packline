import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { IPart } from '../part/partSlice';
import { dummyAction } from './packingJobAPI';

export interface IPackingJob {
    part?: IPart;
    instructions?: string;
    acknowledged?: boolean;
    quantity?: number;
    pieceWeight?: number;
    validPieceWeight?: boolean;
    operator?: string;
    machine?: string;
    jobInProgress?: boolean;
    standardPack?: number;
    boxes?: number;
    partialBoxQuantity?: number;
    objectList?: {
        serial: number;
        quantity: number;
        partial: boolean;
    }[];
}

export interface IPackagingJobState {
    value: IPackingJob;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: IPackagingJobState = {
    value: {},
    status: 'idle',
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const dummyAsync = createAsyncThunk(
    'packagingJob/dummy',
    async (dummyParm: { val1: any }) => {
        // Action defined in packagingJob API
        const response = await dummyAction(dummyParm.val1);

        return response.data;
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
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes

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

            // simplified state modification when part details may have changed by
            if (state.value.part?.partCode === action.payload?.partCode) {
                state.value.acknowledged =
                    state.value.acknowledged &&
                    state.value.instructions ===
                        action.payload?.specialInstructions;
                state.value.part = action.payload;
                return;
            }

            // part has changed, reset all other properties
            state.value.part = action.payload;
            state.value.acknowledged = false;
            state.value.pieceWeight = undefined;
            state.value.quantity = undefined;
            state.value.boxes = undefined;
            state.value.partialBoxQuantity = undefined;
            state.value.operator = undefined;
            state.value.machine = undefined;
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
        },
        setOperator: (state, action: PayloadAction<string>) => {
            state.value.operator = action.payload;
        },
        setMachine: (state, action: PayloadAction<string>) => {
            state.value.machine = action.payload;
        },
        startJob: (state) => {
            state.value.jobInProgress = true;
        },
        stopJob: (state) => {
            state.value.jobInProgress = false;
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
        generateInventory: (state) => {
            state.value.objectList = [];
            for (let i = 0; i < state.value.boxes!; i++) {
                state.value.objectList.push({
                    serial: 1234567,
                    quantity: state.value.part!.standardPack,
                    partial: false,
                });
            }
            if (state.value.partialBoxQuantity) {
                state.value.objectList.push({
                    serial: 1234567,
                    quantity: state.value.partialBoxQuantity,
                    partial: true,
                });
            }
        },
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: (builder) => {
        builder
            .addCase(dummyAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(dummyAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value = action.payload;
            });
    },
});

export const {
    newJob,
    setPart,
    setAcknowledged,
    setPieceWeightQuantity,
    setPieceWeight,
    setOperator,
    setMachine,
    startJob,
    stopJob,
    setBoxes,
    setPartialBoxQuantity,
    generateInventory,
} = packingJobSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectPackingJob = (state: RootState): IPackingJob =>
    state.packingJob.value;
// export const selectIdentity = (state: RootState) => state.identity;

export default packingJobSlice.reducer;
