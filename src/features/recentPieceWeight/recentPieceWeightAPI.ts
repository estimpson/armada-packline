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
import { DemoRecentPieceWeightes } from './demo/demoRecentPieceWeight';
import { IRecentPieceWeight } from './recentPieceWeightSlice';

// data structure returned by web API
interface IRecentPieceWeightAPI {
    pieceWeight: number;
    rowID: number;
}

export function retrieveRecentPieceWeights(
    localApi: ILocalApiState,
    partCode: string,
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError?: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/Packline/RecentPieceWeights?partCode=${partCode}`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
        },
    };

    return new Promise<{
        data: IRecentPieceWeight[];
    }>((resolve) => {
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .get<IRecentPieceWeightAPI[]>(queryString, headers)
                .then((response) => {
                    // mapping of api datastructure to internal datastructure
                    return resolve({
                        data: response.data.map((apiRecentPieceWeight) => {
                            return {
                                pieceWeight: apiRecentPieceWeight.pieceWeight,
                                rowID: apiRecentPieceWeight.rowID,
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
                DemoRecentPieceWeightes.find(
                    (record) => record.partCode === partCode,
                )?.recentPieceWeightList || Array<IRecentPieceWeight>(0),
        });
    });
}
