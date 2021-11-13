import { store } from '../app/store';
import {
    applicationErrorOccurred,
    ApplicationErrorType,
} from './applicationError/applicationErrorSlice';

export function AxiosErrorHandler(ex: any, queryString: string) {
    const location = 'LOCAL'; //queryString.startsWith('/api') ? 'LOCAL' : 'SERVER';
    const [type, message] =
        ex.code === 'ECONNABORTED'
            ? [
                  location === 'LOCAL'
                      ? ApplicationErrorType.LocalTimeout
                      : ApplicationErrorType.RemoteTimeout,
                  `A ${location} timeout has occurred`,
              ]
            : ex.response?.status === 404
            ? [ApplicationErrorType.Unknown, `${location} resource not found`]
            : [
                  ApplicationErrorType.Unknown,
                  `An unexpected ${location} error has occurred`,
              ];

    store.dispatch(
        applicationErrorOccurred({
            type: type,
            message: message,
        }),
    );
}
