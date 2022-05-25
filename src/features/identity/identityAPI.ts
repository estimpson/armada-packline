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
import { IIdentity } from './identitySlice';

interface IIdentityAPI {
    user: string;
    name: string;
}

export function validateLogin(
    localApi: ILocalApiState,
    password: string,
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError?: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/Home/Login?password=${password}`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
        },
    };

    return new Promise<{
        data: IIdentity;
    }>((resolve) => {
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .get<IIdentityAPI>(queryString, headers)
                .then((response) => {
                    return resolve({
                        data: {
                            userCode: response.data.user,
                            userName: response.data.name,
                        },
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

        return resolve({
            data: {
                userCode: 'user',
                userName: 'Sample User',
            },
        });
    });
}
