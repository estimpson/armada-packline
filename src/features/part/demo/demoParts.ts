import { IPart } from '../partSlice';
import { DemoPartPackaging } from '../../partPackaging/demo/demoPartPackaging';

export const DemoParts: IPart[] = [
    {
        partCode: 'XXX',
        partDescription: 'FINAL INSPECT / DEFLASH MACHINE',
        unitWeight: 0.2345,
        weightTolerance: 0.05,
        requiresFinalInspection: true,
        deflashMethod: 'MACHINE',
        packagingList: DemoPartPackaging.filter(
            (partPackaging) => partPackaging.partCode === 'XXX',
        ),
    },
    {
        partCode: 'YYY',
        partDescription: 'FINAL INSPECT / TEARTRIM',
        unitWeight: 0.0177,
        weightTolerance: 0.1,
        requiresFinalInspection: true,
        deflashMethod: 'TEARTRIM',
        packagingList: DemoPartPackaging.filter(
            (partPackaging) => partPackaging.partCode === 'YYY',
        ),
    },
    {
        partCode: 'ZZZ',
        partDescription: 'NO INSPECTION',
        unitWeight: 0.09014,
        weightTolerance: 0.03,
        requiresFinalInspection: false,
        packagingList: DemoPartPackaging.filter(
            (partPackaging) => partPackaging.partCode === 'ZZZ',
        ),
    },
];
