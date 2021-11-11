import { IPartPackaging } from '../partPackagingSlice';

export const DemoPartPackaging: IPartPackaging[] = [
    {
        partCode: 'XXX',
        packageCode: 'B-11.75x11x9',
        packageDescription: 'EXP0121109',
        standardPack: 100,
        specialInstructions: 'Thin blue piece of tape along bottom',
    },
    {
        partCode: 'XXX',
        packageCode: 'B-13.75x11x9',
        packageDescription: 'EXP0121109',
        standardPack: 120,
        specialInstructions: '',
    },
    {
        partCode: 'YYY',
        packageCode: 'B-11.75x11x9',
        packageDescription: 'EXP0121109',
        standardPack: 100,
        specialInstructions: 'Seal in shrink-wrap',
    },
    {
        partCode: 'ZZZ',
        packageCode: 'B-11.75x11x9',
        packageDescription: 'EXP0121109',
        standardPack: 375,
        specialInstructions: 'Thin blue piece of tape along bottom',
    },
];
