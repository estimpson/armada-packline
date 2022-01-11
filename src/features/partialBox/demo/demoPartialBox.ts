import { IPartialBox } from '../partialBoxListSlice';

export const DemoPartialBoxes: Array<{
    partCode: string;
    partialBoxList: IPartialBox[];
}> = [
    {
        partCode: 'XXX',

        partialBoxList: [
            {
                serial: 123,
                packageType: 'B-11.75x11x9',
                quantity: 55,
                lastDate: '2016-02-05 08:21:55.047',
            },
            {
                serial: 245,
                packageType: 'B-13.75x11x9',
                quantity: 99,
                lastDate: '2016-02-05 06:14:45.953',
            },
        ],
    },
    {
        partCode: 'YYY',

        partialBoxList: [
            {
                serial: 999,
                packageType: 'B-11.75x11x9',
                quantity: 55,
                lastDate: '2016-02-04 20:19:39.313',
            },
        ],
    },
];
