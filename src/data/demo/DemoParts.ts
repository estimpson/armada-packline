import { IPart } from '../Part';

export const DemoParts: IPart[] = [
    {
        partCode: 'XXX',
        partDescription: 'FINAL INSPECT / DEFLASH MACHINE',
        unitWeight: 0.2345,
        weightTolerance: 0.05,
        standardPack: 100,
        specialInstructions: 'Thin blue piece of tape along bottom',
        requiresFinalInspection: true,
        deflashMethod: 'MACHINE',
    },
    {
        partCode: 'YYY',
        partDescription: 'FINAL INSPECT / TEARTRIM',
        unitWeight: 0.0177,
        weightTolerance: 0.1,
        standardPack: 250,
        specialInstructions: 'Seal in shrink-wrap',
        requiresFinalInspection: true,
        deflashMethod: 'TEARTRIM',
    },
    {
        partCode: 'ZZZ',
        partDescription: 'NO INSPECTION',
        unitWeight: 0.09014,
        weightTolerance: 0.03,
        standardPack: 375,
        requiresFinalInspection: false,
    },
];
