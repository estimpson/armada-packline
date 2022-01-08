import axios from 'axios';
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
    setError?: React.Dispatch<React.SetStateAction<string>>,
) {
    const queryString = `https://localhost:${localApi.port}/Packline/PartsWithPack`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
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
                            : 'An unexpected error has occurred';
                    setError && setError(error);
                });
        }

        // fallback to demo data
        return resolve({
            data: DemoParts,
        });
    });
}
