import {
    ActionCreatorWithPayload,
    AnyAction,
    ThunkDispatch,
} from '@reduxjs/toolkit';
import {
    ApplicationErrorType,
    IApplicationErrorState,
} from './applicationError/applicationErrorSlice';

export function handleAxiosException(
    ex: any,
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError?: ActionCreatorWithPayload<IApplicationErrorState, string>,
): void {
    if (ex.response) {
        console.log(ex.response.data);
        try {
            let errors = (ex.response.data as string)
                .split('\n')[0]
                .split(':')
                .slice(1);
            setError &&
                dispatch(
                    setError({
                        type: ApplicationErrorType.Unknown,
                        message: errors.join(),
                    }),
                );
        } catch {
            setError &&
                dispatch(
                    setError({
                        type: ApplicationErrorType.Unknown,
                        message: ex.response.data,
                    }),
                );
        }
        return;
    }
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
}
