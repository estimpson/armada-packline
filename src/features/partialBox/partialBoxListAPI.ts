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
import { ILocalApiState } from '../localApi/localApiSlice';
import { DemoPartialBoxes } from './demo/demoPartialBox';
import { IPartialBox } from './partialBoxListSlice';

// data structure returned by web API
interface IPartialBoxAPI {
    serial: number;
    packageType: string;
    quantity: number;
    notes?: string;
    lastDate: string;
}

export function retrievePartialBoxes(
    localApi: ILocalApiState,
    partCode: string,
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError?: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/Packline/Partials?partCode=${partCode}`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
        },
    };

    return new Promise<{
        data: IPartialBox[];
    }>((resolve) => {
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .get<IPartialBoxAPI[]>(queryString, headers)
                .then((response) => {
                    // mapping of api datastructure to internal datastructure
                    return resolve({
                        data: response.data.map((apiPartialBox) => {
                            return {
                                serial: apiPartialBox.serial,
                                packageType: apiPartialBox.packageType,
                                quantity: apiPartialBox.quantity,
                                notes: apiPartialBox.notes,
                                lastDate: apiPartialBox.lastDate,
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
            data:
                DemoPartialBoxes.find((record) => record.partCode === partCode)
                    ?.partialBoxList || Array<IPartialBox>(0),
        });
    });
}
