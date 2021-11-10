import { DemoMachines } from '../../machine/demo/demoMachines';
import { DemoParts } from '../../part/demo/demoParts';
import { IPackingJob } from '../packingJobSlice';

export interface IDemoPackingJob extends IPackingJob {
    step: string;
}

export const DemoJobs: IDemoPackingJob[] = [
    { step: '1: Choose a part' },
    {
        step: '2: Display Special Instructions & Require Acknowledment (if present)',
        part: DemoParts[0],
        instructions:
            'Place a thin strip of blue tape along bottom edge of box',
    },
    {
        step: "3.1 [part requires 'Final Inspection']: Enter Piece Weight",
        part: DemoParts[0],
        instructions:
            'Place a thin strip of blue tape along bottom edge of box',

        acknowledged: true,
    },
    {
        step: "4.1.1 [part requires 'Final Inspection']: Verify piece weight",
        part: DemoParts[0],
        instructions:
            'Place a thin strip of blue tape along bottom edge of box',
        acknowledged: true,
        quantity: 20,
        pieceWeight: 0.012357,
        validPieceWeight: false,
    },
    {
        step: "5.1.1 [part requires 'Final Inspection']: Enter Deflash Operator and Machine",
        part: DemoParts[0],
        instructions:
            'Place a thin strip of blue tape along bottom edge of box',
        acknowledged: true,
        quantity: 20,
        pieceWeight: 0.012357,
        validPieceWeight: true,
    },
    {
        step: "6.1.1 [part requires 'Final Inspection']: Open Job",
        part: DemoParts[0],
        instructions:
            'Place a thin strip of blue tape along bottom edge of box',
        acknowledged: true,
        quantity: 20,
        pieceWeight: 0.012357,
        validPieceWeight: true,
        operator: 'JK',
        machine: DemoMachines[3],
    },
    {
        step: '7: Enter Lot Quantity',
        part: DemoParts[0],
        instructions:
            'Place a thin strip of blue tape along bottom edge of box',
        acknowledged: true,
        quantity: 20,
        pieceWeight: 0.012357,
        validPieceWeight: true,
        operator: 'JK',
        machine: DemoMachines[3],
        jobInProgress: true,
        standardPack: 100,
    },
    {
        step: '8: Generate Inventory',
        part: DemoParts[0],
        instructions:
            'Place a thin strip of blue tape along bottom edge of box',
        acknowledged: true,
        quantity: 20,
        pieceWeight: 0.012357,
        validPieceWeight: true,
        operator: 'JK',
        machine: DemoMachines[3],
        jobInProgress: true,
        standardPack: 100,
        boxes: 3,
        partialBoxQuantity: 17,
    },
    {
        step: '9: Review Inventory',
        part: DemoParts[0],
        instructions:
            'Place a thin strip of blue tape along bottom edge of box',
        acknowledged: true,
        quantity: 20,
        pieceWeight: 0.012357,
        validPieceWeight: true,
        operator: 'JK',
        machine: DemoMachines[3],
        jobInProgress: true,
        standardPack: 100,
        boxes: 3,
        partialBoxQuantity: 17,
        objectList: [
            {
                serial: 5555123,
                quantity: 100,
                partial: false,
                printed: false,
            },
            {
                serial: 5555124,
                quantity: 100,
                partial: false,
                printed: false,
            },
            {
                serial: 5555125,
                quantity: 100,
                partial: false,
                printed: false,
            },
            {
                serial: 5555126,
                quantity: 17,
                partial: true,
                printed: false,
            },
        ],
    },
    {
        step: '10: Print Labels',
        part: DemoParts[0],
        instructions:
            'Place a thin strip of blue tape along bottom edge of box',
        acknowledged: true,
        quantity: 20,
        pieceWeight: 0.012357,
        validPieceWeight: true,
        operator: 'JK',
        machine: DemoMachines[3],
        jobInProgress: true,
        standardPack: 100,
        boxes: 3,
        partialBoxQuantity: 17,
        objectList: [
            {
                serial: 5555123,
                quantity: 100,
                partial: false,
                printed: false,
            },
            {
                serial: 5555124,
                quantity: 100,
                partial: false,
                printed: false,
            },
            {
                serial: 5555125,
                quantity: 100,
                partial: false,
                printed: false,
            },
            {
                serial: 5555126,
                quantity: 17,
                partial: true,
                printed: false,
            },
        ],
    },
];
