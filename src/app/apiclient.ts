import axios from 'axios';
import { ILocalApiState } from '../features/localApi/localApiSlice';

interface apiClientInterface {
    axiosClient: any;
    initializeAxios(localApiDetails: ILocalApiState): void;
}

export const apiClient: apiClientInterface = {
    axiosClient: axios.create(),
    initializeAxios: (localApiDetails: ILocalApiState) => {},
};
