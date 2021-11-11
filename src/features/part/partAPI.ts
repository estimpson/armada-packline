import axios from 'axios';
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
    setError?: React.Dispatch<React.SetStateAction<string>>,
) {
    return new Promise<{
        data: IPart[];
    }>((resolve) => {
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .get<IPartAPI[]>(`https://localhost:5000/Packline/Parts`)
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
