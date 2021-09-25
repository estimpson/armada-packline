import axios from 'axios';
import React from 'react';
import { IIdentity } from './identitySlice';

interface IIdentityAPI {
    user: string;
    name: string;
}

export function validateLogin(
    user: string,
    password: string,
    setError?: React.Dispatch<React.SetStateAction<string>>,
) {
    return new Promise<{
        data: IIdentity;
    }>((resolve) => {
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .get<IIdentityAPI>(
                    `https://www.fxsupplierportal.com/api/Login?fxSPID=${user}&password=${password}`,
                )
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
