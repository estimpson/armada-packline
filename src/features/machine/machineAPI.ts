import axios from 'axios';
import { DemoMachines } from './demo/demoMachines';
import { IMachine } from './machineSlice';

// data structure returned by web API
interface IMachineAPI {
    machineCode: string;
    machineDescription: string;
}

export function retrieveMachines(
    setError?: React.Dispatch<React.SetStateAction<string>>,
) {
    return new Promise<{
        data: IMachine[];
    }>((resolve) => {
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .get<IMachineAPI[]>(`https://localhost:5000/Packline/Machines`)
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
