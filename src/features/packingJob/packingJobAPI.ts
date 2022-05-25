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
import { handleAxiosException } from '../handleAxiosException';
import { IIdentity } from '../identity/identitySlice';
import { ILocalApiState } from '../localApi/localApiSlice';
import { IMachine } from '../machine/machineSlice';
import { IPart } from '../part/partSlice';
import { IPackingJob, IPackingObject } from './packingJobSlice';

export interface IPackingJobCombineAPI {
    packingJobNumber: string;
    fromSerial: number;
    fromOriginalQuantity: number;
    fromNewQuantity: number;
    fromReprint: boolean;
    toSerial: number;
    toOriginalQuantity: number;
    toNewQuantity: number;
    rowID: number;
}

export interface IPackingJobInventoryAPI {
    packingJobNumber: string;
    serial: number;
    quantity: number;
    printed: boolean;
    rowId: number;
    combines: IPackingJobCombineAPI[];
}

export function generatePackingJobInventory(
    localApi: ILocalApiState,
    identity: IIdentity,
    packingJob: IPackingJob,
    parts: IPart[],
    machines: IMachine[],
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError?: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/Packline/GeneratePreObjects`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };

    return new Promise<{
        data: IPackingJob;
    }>((resolve) => {
        const jsonBody = {
            packingJobNUmber: packingJob.packingJobNumber!,
            boxes: packingJob.boxes,
            partialBoxQuantity: packingJob.partialBoxQuantity,
        };

        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .post<IPackingJobAPI>(queryString, jsonBody, headers)
                .then((response) => {
                    let newPackingJob: IPackingJob = mapPackingJobFromAPI(
                        response,
                        parts,
                        machines,
                        packingJob,
                    );

                    return resolve({
                        data: newPackingJob,
                    });
                })
                .catch((ex) => handleAxiosException(ex, dispatch, setError));
        }
    });
}

export function resetPackingJobInventory(
    localApi: ILocalApiState,
    identity: IIdentity,
    packingJob: IPackingJob,
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError?: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/Packline/CancelPreObjects`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };

    return new Promise<void>((resolve) => {
        const jsonBody = {
            packingJobNUmber: packingJob.packingJobNumber!,
        };

        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .post<void>(queryString, jsonBody, headers)
                .then((response) => {
                    return resolve();
                })
                .catch((ex) => handleAxiosException(ex, dispatch, setError));
        }
    });
}

// data structures returned by web API
export interface IPackingCombinedObjectAPI {
    packingJobNumber: string;
    fromSerial: number;
    fromOriginalQuantity: number;
    fromNewQuantity: number;
    fromReprint: boolean;
    toSerial: number;
    toOriginalquantity: number;
    toNewQuantity: number;
    rowId: number;
}

export interface IPackingObjectAPI {
    packingJobNumber: string;
    serial: number;
    quantity: number;
    printed: boolean;
    rowId: number;
    combines?: IPackingCombinedObjectAPI[];
}

export interface IPackingJobAPI {
    packingJobNumber: string;
    partCode: string;
    packagingCode: string;
    specialInstructions?: string;
    pieceWeightQuantity: number;
    pieceWeight: number;
    pieceWeightTolerance: number;
    pieceWeightValid: boolean;
    pieceWeightDiscrepancyNote?: string;
    deflashOperator: string;
    deflashMachine: string;
    boxes: number | undefined;
    partialBoxQuantity: number | undefined;
    shelfInventoryFlag: number;
    previousJobShelfInventoryFlag: number;
    objects?: IPackingObjectAPI[];
    rowID: number;
}

export function openPackingJob(
    localApi: ILocalApiState,
    identity: IIdentity,
    packingJob: IPackingJob,
    parts: IPart[],
    machines: IMachine[],
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError?: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/Packline/OpenPackingJob`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };
    // create a promise that returns data of required type
    return new Promise<{
        data: IPackingJob;
    }>((resolve) => {
        const jsonBody = {
            partCode: packingJob.part!.partCode,
            packagingCode: packingJob.packaging!.packageCode,
            standardPack: packingJob.packaging!.standardPack,
            specialInstructions: packingJob.packaging!.specialInstructions,
            pieceWeightQuantity: packingJob.quantity!,
            pieceWeight: packingJob.pieceWeight!,
            pieceWeightTolerance: packingJob.part!.weightTolerance,
            pieceWeightValid: packingJob.validPieceWeight!,
            pieceWeightDiscrepancyNote: packingJob.pieceWeightDiscrepancyNote,
            deflashOperator: packingJob.operator!,
            deflashMachine: packingJob.machine!.machineCode,
        };

        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .post<IPackingJobAPI>(queryString, jsonBody, headers)
                .then((response) => {
                    let newPackingJob: IPackingJob = mapPackingJobFromAPI(
                        response,
                        parts,
                        machines,
                        packingJob,
                    );

                    return resolve({
                        data: newPackingJob,
                    });
                })
                .catch((ex) => handleAxiosException(ex, dispatch, setError));
        }
    });
}

export function cancelPackingJob(
    localApi: ILocalApiState,
    identity: IIdentity,
    packingJob: IPackingJob,
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError?: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    console.log(`Begin api`);

    const queryString = `https://localhost:${localApi.port}/Packline/CancelPackingJob`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };
    // create a promise that returns data of required type
    return new Promise<void>((resolve) => {
        if (process.env['REACT_APP_API'] === 'Enabled') {
            const jsonBody = { packingJobNumber: packingJob.packingJobNumber };

            return axios
                .post(queryString, jsonBody, headers)
                .then(() => {
                    console.log(`Api returned`);
                    // mapping of api datastructure to internal datastructure
                    return resolve();
                })
                .catch((ex) => handleAxiosException(ex, dispatch, setError));
        }
    });
}

export function getPackingJob(
    localApi: ILocalApiState,
    identity: IIdentity,
    packingJob: IPackingJob,
    parts: IPart[],
    machines: IMachine[],
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError?: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/Packline/PackingJob?packingJobNumber=${packingJob.packingJobNumber}`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };
    // create a promise that returns data of required type
    return new Promise<{
        data: IPackingJob;
    }>((resolve) => {
        if (!packingJob.packingJobNumber) return packingJob;
        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .get<IPackingJobAPI>(queryString, headers)
                .then((response) => {
                    let newPackingJob: IPackingJob = mapPackingJobFromAPI(
                        response,
                        parts,
                        machines,
                        packingJob,
                    );

                    return resolve({
                        data: newPackingJob,
                    });
                })
                .catch((ex) => handleAxiosException(ex, dispatch, setError));
        }
    });
}

export function combinePreObject(
    localApi: ILocalApiState,
    identity: IIdentity,
    packingJob: IPackingJob,
    parts: IPart[],
    machines: IMachine[],
    combineSerial: number,
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError?: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/Packline/CombinePreObject`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };
    // create a promise that returns data of required type
    return new Promise<{
        data: IPackingJob;
    }>((resolve) => {
        const jsonBody = {
            packingJobNumber: packingJob.packingJobNumber!,
            combineSerial: combineSerial,
        };

        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .post<IPackingJobAPI>(queryString, jsonBody, headers)
                .then((response) => {
                    let newPackingJob: IPackingJob = mapPackingJobFromAPI(
                        response,
                        parts,
                        machines,
                        packingJob,
                    );

                    return resolve({
                        data: newPackingJob,
                    });
                })
                .catch((ex) => handleAxiosException(ex, dispatch, setError));
        }
    });
}

export function printPackingJobLabels(
    localApi: ILocalApiState,
    identity: IIdentity,
    packingJob: IPackingJob,
    parts: IPart[],
    machines: IMachine[],
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError?: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/Packline/PrintPackingJobBT`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };
    // create a promise that returns data of required type
    return new Promise<{
        data: IPackingJob;
    }>((resolve) => {
        if (!packingJob.packingJobNumber) return packingJob;
        const jsonBody = {
            packingJobNumber: packingJob.packingJobNumber!,
        };

        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .post<IPackingJobAPI>(queryString, jsonBody, headers)
                .then((response) => {
                    let newPackingJob: IPackingJob = mapPackingJobFromAPI(
                        response,
                        parts,
                        machines,
                        packingJob,
                    );

                    return resolve({
                        data: newPackingJob,
                    });
                })
                .catch((ex) => handleAxiosException(ex, dispatch, setError));
        }
    });
}

export function completePackingJob(
    localApi: ILocalApiState,
    identity: IIdentity,
    packingJob: IPackingJob,
    parts: IPart[],
    machines: IMachine[],
    dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
    setError?: ActionCreatorWithPayload<IApplicationErrorState, string>,
) {
    const queryString = `https://localhost:${localApi.port}/Packline/CompletePackingJob`;
    const headers = {
        headers: {
            'x-signing-key': localApi.signingKey,
            'Content-Type': 'application/json',
            user: identity.userCode,
        },
    };
    // create a promise that returns data of required type
    return new Promise<{
        data: IPackingJob;
    }>((resolve) => {
        if (!packingJob.packingJobNumber) return packingJob;
        const jsonBody = {
            packingJobNumber: packingJob.packingJobNumber!,
            shelfInventoryFlag: packingJob.shelfInventoryFlag,
            jobDoneFlag: packingJob.jobIsDoneFlag,
        };

        if (process.env['REACT_APP_API'] === 'Enabled') {
            return axios
                .post<IPackingJobAPI>(queryString, jsonBody, headers)
                .then((response) => {
                    let newPackingJob: IPackingJob = mapPackingJobFromAPI(
                        response,
                        parts,
                        machines,
                        packingJob,
                    );

                    return resolve({
                        data: newPackingJob,
                    });
                })
                .catch((ex) => handleAxiosException(ex, dispatch, setError));
        }
    });
}

function mapPackingJobFromAPI(
    response: { data: IPackingJobAPI },
    parts: IPart[],
    machines: IMachine[],
    packingJob: IPackingJob,
) {
    let apiPackingJob = response.data;
    // mapping of api datastructure to internal datastructure
    let part = parts.find((p) => p.partCode === apiPackingJob.partCode);
    let partPack = part?.packagingList.find(
        (pp) => pp.packageCode === apiPackingJob.packagingCode,
    );
    let machine = machines.find(
        (m) => m.machineCode === apiPackingJob.deflashMachine,
    );
    let objectList = apiPackingJob.objects?.map((object) => {
        return {
            part: part!,
            serial: object.serial,
            quantity: object.quantity,
            partial: object.quantity < partPack!.standardPack,
            printed: object.printed,
            combinedObjects: object.combines?.map((combine) => {
                return {
                    serial: combine.fromSerial,
                    quantityOriginal: combine.fromOriginalQuantity,
                    quantityUsed:
                        combine.fromOriginalQuantity - combine.fromNewQuantity,
                    quantityRemaining: combine.fromNewQuantity,
                };
            }),
        };
    });
    let boxes = objectList
        ? objectList.filter(
              (object) => object.quantity === partPack?.standardPack,
          ).length
        : packingJob.boxes;
    let partialBoxQuantity = objectList
        ? objectList?.find((object) => object.quantity < partPack!.standardPack)
              ?.quantity
        : packingJob.partialBoxQuantity;
    let newPackingJob: IPackingJob = {
        demoJob: false,
        packingJobNumber: apiPackingJob.packingJobNumber,
        part: part,
        packaging: partPack,
        acknowledged: true,
        quantity: apiPackingJob.pieceWeightQuantity,
        pieceWeight: apiPackingJob.pieceWeight,
        validPieceWeight: apiPackingJob.pieceWeightValid,
        pieceWeightDiscrepancyNote: apiPackingJob.pieceWeightDiscrepancyNote,
        overridePieceWeight: !!apiPackingJob.pieceWeightDiscrepancyNote,
        operator: apiPackingJob.deflashOperator,
        machine: machine,
        jobInProgress: !!apiPackingJob.packingJobNumber,
        boxes: boxes,
        partialBoxQuantity: partialBoxQuantity,
        objectList: objectList,
        shelfInventoryFlag:
            apiPackingJob.shelfInventoryFlag !== -1
                ? apiPackingJob.shelfInventoryFlag === 1
                : undefined,
        previousJobShelfInventoryFlag:
            apiPackingJob.previousJobShelfInventoryFlag !== null
                ? apiPackingJob.previousJobShelfInventoryFlag === 1
                : undefined,
    };
    return newPackingJob;
}
