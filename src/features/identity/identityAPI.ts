import axios from 'axios';
import React from 'react';
import { ILocalApiState } from '../localApi/localApiSlice';
import { IIdentity } from './identitySlice';
import { AxiosErrorHandler } from '../AxiosErrorHandler';

interface IIdentityAPI {
    user: string;
    name: string;
}

export function validateLogin(
    localApi: ILocalApiState,
    user: string,
    password: string,
    setError?: React.Dispatch<React.SetStateAction<string>>,
) {
    // let localApi = store.getState()?.localApiDetails;
    const queryString = `https://localhost:${localApi.port}/Packline/Login?user=${user}&password=${password}`;
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
                            : 'An unexpected error has occurred';
                    setError && setError(error);
                });
        }

        return resolve({
            data: {
                userCode: user,
                userName: 'Sample User',
            },
        });
    });
}
