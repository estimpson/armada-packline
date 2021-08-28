import axios from 'axios';
import React from 'react';
import { IIdentity } from './identitySlice';

interface IIdentityAPI {
    fxSupplier: string;
    name: string;
    printerDriver: string;
    printerQty: number;
}

export function validateLogin(
    fxSPID: string,
    password: string,
    setError?: React.Dispatch<React.SetStateAction<string>>,
) {
    return new Promise<{
        data: IIdentity;
    }>((resolve) => {
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .get<IIdentityAPI>(
                    `https://www.fxsupplierportal.com/api/Login?fxSPID=${fxSPID}&password=${password}`,
                )
                .then((response) => {
                    return resolve({
                        data: {
                            supplierCode: response.data.fxSupplier,
                            userName: response.data.name,
                            printerDriver: response.data.printerDriver,
                            printerCopies: response.data.printerQty,
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
                supplierCode: 'ROC0010',
                userName: 'Rochester Metals',
                printerDriver: 'Epson',
                printerCopies: 1,
            },
        });
    });
}
