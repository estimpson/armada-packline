import axios from 'axios';
import { DemoParts } from './demo/demoParts';
import { IPart } from './partSlice';

// data structure returned by web API
interface IPartAPI {
    partCode: string;
    partDescription: string;
    unitWeight: number;
    weightTolerance: number;
    standardPack: number;
    specialInstructions?: string;
    requiresFinalInspection: boolean;
    deflashMethod?: 'MACHINE' | 'TEARTRIM';
}

export function retrieveParts(
    setError?: React.Dispatch<React.SetStateAction<string>>,
) {
    return new Promise<{
        data: IPart[];
    }>((resolve) => {
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .get<IPartAPI[]>(
                    `https://fxpacklinewebapi/part/getpacklinelist`,
                )
                .then((response) => {
                    // mapping of api datastructure to internal datastructure
                    return resolve({
                        data: response.data.map((apiPart) => {
                            return apiPart;
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
