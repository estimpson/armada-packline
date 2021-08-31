import axios from 'axios';
import { IPreObject } from '../PreObjectList';
import { AxiosErrorHandler } from './AxiosErrorHandler';

export function saveLotQuantityChange(
    preObjectList: IPreObject[],
    rowIndex: number,
    modifiedPreObject: IPreObject,
    setPreObjectList: React.Dispatch<React.SetStateAction<IPreObject[]>>,
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
            .catch((ex) => AxiosErrorHandler(ex, queryString));
    } else {
        preObjectList[rowIndex] = modifiedPreObject;
    }
    setPreObjectList(preObjectList);
    return true;
}
