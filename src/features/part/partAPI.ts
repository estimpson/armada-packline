import {
    ActionCreatorWithPayload,
    AnyAction,
    ThunkDispatch,
} from '@reduxjs/toolkit';
import axios from 'axios';
import {
    ApplicationErrorType,
    IApplicationErrorState,
} from '../applicationError/applicationErrorSlice';
import { IIdentity } from '../identity/identitySlice';
import { ILocalApiState } from '../localApi/localApiSlice';
import { IPartPackaging } from '../partPackaging/partPackagingSlice';
import { DemoParts } from './demo/demoParts';
import { IPart } from './partSlice';

// data structure returned by web API
interface IPartAPI {
    partCode: string;
    partDescription: string;
    unitWeight?: number;
    weightTolerance: number;
    standardPack: number;
    defaultPackaging?: string;
    specialInstructions?: string;
    requiresFinalInspection: boolean;
    deflashMethod?: 'MACHINE' | 'TEARTRIM';
    packagingList: IPartPackaging[];
}

export function retrieveParts(
    localApi: ILocalApiState,
    identity: IIdentity,
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError?: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/Packline/PartsWithPack`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            user: identity.userCode,
        },
    };

    return new Promise<{
        data: IPart[];
    }>((resolve) => {
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .get<IPartAPI[]>(queryString, headers)
                .then((response) => {
                    // mapping of api datastructure to internal datastructure
                    return resolve({
                        data: response.data.map((apiPart) => {
                            return {
                                unitWeight: apiPart.unitWeight || 0,
                                ...apiPart,
                            };
                        }),
                    });
                })
                .catch((ex) => {
                    let error =
                        ex.code === 'ECONNABORTED'
                            ? 'A timeout has occurred'
                            : ex.response?.status === 404
                            ? 'Resource not found'
                            : ex.message;
                    setError &&
                        dispatch(
                            setError({
                                type: ApplicationErrorType.Unknown,
                                message: error,
                            }),
                        );
                });
        }

        // fallback to demo data
        return resolve({
            data: DemoParts,
        });
    });
}
