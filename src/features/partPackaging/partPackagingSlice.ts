import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface IPartPackaging {
    partCode: string;
    packageCode: string;
    packageDescription: string;
    standardPack: number;
    specialInstructions?: string;
}
