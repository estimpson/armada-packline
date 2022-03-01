import axios from 'axios';
import React from 'react';
import { IIdentity } from '../identity/identitySlice';
import { ILocalApiState } from '../localApi/localApiSlice';
import { IPackingJob } from './packingJobSlice';

// data structure returned by web API
export interface IPackingJobAPI {
    packingJobNumber: string;
    partCode: string;
    packagingCode: string;
    specialInstructions?: string;
    pieceWeightQuantity: number;
    pieceWeight: number;
    pieceWeightTolerance: number;
    pieceWeightValid: boolean;
    pieceWeightDiscrepancyNote?: string;
    deflashOperator: string;
    deflashMachine: string;
    rowID: number;
}

export function openPackingJob(
    localApi: ILocalApiState,
    identity: IIdentity,
    packingJob: IPackingJob,
    setError?: React.Dispatch<React.SetStateAction<string>>,
) {
    const queryString = `https://localhost:${localApi.port}/Packline/OpenPackingJob`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };
    // create a promise that returns data of required type
    return new Promise<{
        data: IPackingJobAPI;
    }>((resolve) => {
        const jsonBody = {
            partCode: packingJob.part!.partCode,
            packagingCode: packingJob.packaging!.packageCode,
            specialInstructions: packingJob.packaging!.specialInstructions,
            pieceWeightQuantity: packingJob.quantity!,
            pieceWeight: packingJob.pieceWeight!,
            pieceWeightTolerance: packingJob.part!.weightTolerance,
            pieceWeightValid: packingJob.validPieceWeight!,
            pieceWeightDiscrepancyNote: packingJob.pieceWeightDiscrepancyNote,
            deflashOperator: packingJob.operator!,
            deflashMachine: packingJob.machine!.machineCode,
        };

        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .post<IPackingJobAPI>(queryString, jsonBody, headers)
                .then((response) => {
                    // mapping of api datastructure to internal datastructure
                    return resolve({
                        data: response.data,
                    });
                })
                .catch((ex) => {
                    let error =
                        ex.code === 'ECONNABORTED'
                            ? 'A timeout has occurred'
                            : ex.response?.status === 404
                            ? 'Resource not found'
                            : 'An unexpected error has occurred';
                    setError && setError(error);
                });
        }
    });
}

export function cancelPackingJob(
    localApi: ILocalApiState,
    identity: IIdentity,
    packingJob: IPackingJob,
    setError?: React.Dispatch<React.SetStateAction<string>>,
) {
    console.log(`Begin api`);

    const queryString = `https://localhost:${localApi.port}/Packline/CancelPackingJob`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };
    // create a promise that returns data of required type
    return new Promise<void>((resolve) => {
        if (process.env['REACT_APP_API'] === 'Enabled') {
            const jsonBody = { packingJobNumber: packingJob.packingJobNumber };

            return axios
                .post(queryString, jsonBody, headers)
                .then(() => {
                    console.log(`Api returned`);
                    // mapping of api datastructure to internal datastructure
                    return resolve();
                })
                .catch((ex) => {
                    console.log(`Api errored`);
                    let error =
                        ex.code === 'ECONNABORTED'
                            ? 'A timeout has occurred'
                            : ex.response?.status === 404
                            ? 'Resource not found'
                            : 'An unexpected error has occurred';
                    setError && setError(error);
                });
        }
    });
}
