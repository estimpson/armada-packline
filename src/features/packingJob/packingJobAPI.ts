import axios from 'axios';
import React from 'react';
import { IPackingJob } from './packingJobSlice';

export function dummyAction(
    val1: any,
    setError?: React.Dispatch<React.SetStateAction<string>>,
) {
    // create a promise that returns data of required type
    return new Promise<{
        data: IPackingJob;
    }>((resolve) => {
        // perform some asynchronous task to generate the required data
        const dummy: IPackingJob = { demoJob: false };

        // return the resolved data when the task completes
        return resolve({
            data: dummy,
        });
    });
}
