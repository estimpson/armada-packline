import axios from 'axios';
import { ILocalApiState } from '../localApi/localApiSlice';
import { DemoMachines } from './demo/demoMachines';
import { IMachine } from './machineSlice';

// data structure returned by web API
interface IMachineAPI {
    machineCode: string;
    machineDescription: string;
}

export function retrieveMachines(
    localApi: ILocalApiState,
    setError?: React.Dispatch<React.SetStateAction<string>>,
) {
    const queryString = `https://localhost:${localApi.port}/Packline/Machines`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
        },
    };

    return new Promise<{
        data: IMachine[];
    }>((resolve) => {
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .get<IMachineAPI[]>(queryString, headers)
                .then((response) => {
                    // mapping of api datastructure to internal datastructure
                    return resolve({
                        data: response.data,
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
            data: DemoMachines,
        });
    });
}
