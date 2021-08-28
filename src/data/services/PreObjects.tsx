import axios from 'axios';
import { IPreObject } from '../PreObjectList';

export function saveLotQuantityChange(
    preObjectList: IPreObject[],
    rowIndex: number,
    modifiedPreObject: IPreObject,
    setPreObjectList: React.Dispatch<React.SetStateAction<IPreObject[]>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
) {
    if (process.env['REACT_APP_API'] === 'Enabled') {
        let queryString = `https://www.fxsupplierportal.com/api/PreObjects/PreObject?supplierCode=${encodeURIComponent(
            modifiedPreObject.supplierCode,
        )}&serialNumber=${encodeURIComponent(
            modifiedPreObject.serial,
        )}&newLotNumber=${encodeURIComponent(
            modifiedPreObject.lotNumber,
        )}&newQuantity=${encodeURIComponent(modifiedPreObject.quantity)}`;

        console.log(queryString);
        axios
            .patch<IPreObject>(queryString)
            .then((response) => {
                preObjectList[rowIndex] = response.data;
            })
            .catch((ex) => {
                let error =
                    ex.code === 'ECONNABORTED'
                        ? 'A timeout has occurred'
                        : ex.response?.status === 404
                        ? 'Resource not found'
                        : 'An unexpected error has occurred';
                setError(error);
            });
    } else {
        preObjectList[rowIndex] = modifiedPreObject;
    }
    setPreObjectList(preObjectList);
    return true;
}
