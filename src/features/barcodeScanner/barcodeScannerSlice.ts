import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface IScannerData {
    scanData: string;
    dateReceived: string;
}

const initialState = Array<IScannerData>(0);

export const barcodeScannerSlice = createSlice({
    name: 'barcodeScanner',
    initialState,
    reducers: {
        newScan: (state, action: PayloadAction<string>) => {
            let newScannerData: IScannerData = {
                scanData: action.payload,
                dateReceived: new Date().toString(),
            };
            return state.concat(newScannerData);
        },
        scanHandled: (state) => {
            state.pop();
        },
    },
});

export const { newScan, scanHandled } = barcodeScannerSlice.actions;

export const selectScannerData = (state: RootState) =>
    state.scannerData[state.scannerData.length - 1];

export default barcodeScannerSlice.reducer;
