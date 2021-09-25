import { IJob } from '../Job';

export const DemoJobs: IJob[] = [
    { step: '1: Choose a part' },
    {
        step: '2: Display Special Instructions & Require Acknowledment (if present)',
        part: '1',
        instructions:
            'Place a thin strip of blue tape along bottom edge of box',
    },
    {
        step: "3.1 [part requires 'Final Inspection']: Enter Piece Weight",
        part: '1',
        instructions:
            'Place a thin strip of blue tape along bottom edge of box',

        acknowledged: true,
    },
    {
        step: "4.1.1 [part requires 'Final Inspection']: Verify piece weight",
        part: '1',
        instructions:
            'Place a thin strip of blue tape along bottom edge of box',
        acknowledged: true,
        quantity: 20,
        pieceWeight: 0.012357,
        valid: false,
    },
    {
        step: "5.1.1 [part requires 'Final Inspection']: Enter Deflash Operator and Machine",
        part: '1',
        instructions:
            'Place a thin strip of blue tape along bottom edge of box',
        acknowledged: true,
        quantity: 20,
        pieceWeight: 0.012357,
        valid: true,
    },
    {
        step: "6.1.1 [part requires 'Final Inspection']: Open Job",
        part: '1',
        instructions:
            'Place a thin strip of blue tape along bottom edge of box',
        acknowledged: true,
        quantity: 20,
        pieceWeight: 0.012357,
        valid: true,
        operator: 'JK',
        machine: 'D1',
    },
    {
        step: '7: Enter Lot Quantity',
        part: '1',
        instructions:
            'Place a thin strip of blue tape along bottom edge of box',
        acknowledged: true,
        quantity: 20,
        pieceWeight: 0.012357,
        valid: true,
        operator: 'JK',
        machine: 'D1',
        jobInProgress: true,
        standardPack: 100,
    },
    {
        step: '8: Generate Inventory',
        part: 'XXX',
        instructions:
            'Place a thin strip of blue tape along bottom edge of box',
        acknowledged: true,
        quantity: 20,
        pieceWeight: 0.012357,
        valid: true,
        operator: 'JK',
        machine: 'D1',
        jobInProgress: true,
        standardPack: 100,
        boxes: 3,
        partialBoxQuantity: 17,
    },
    {
        step: '9: Review Inventory',
        part: 'XXX',
        instructions:
            'Place a thin strip of blue tape along bottom edge of box',
        acknowledged: true,
        quantity: 20,
        pieceWeight: 0.012357,
        valid: true,
        operator: 'JK',
        machine: 'D1',
        jobInProgress: true,
        standardPack: 100,
        boxes: 3,
        partialBoxQuantity: 17,
        objectList: [
            {
                serial: 5555123,
                quantity: 100,
                partial: false,
            },
            {
                serial: 5555124,
                quantity: 100,
                partial: false,
            },
            {
                serial: 5555125,
                quantity: 100,
                partial: false,
            },
            {
                serial: 5555126,
                quantity: 17,
                partial: true,
            },
        ],
    },
    {
        step: '10: Print Labels',
        part: 'XXX',
        instructions:
            'Place a thin strip of blue tape along bottom edge of box',
        acknowledged: true,
        quantity: 20,
        pieceWeight: 0.012357,
        valid: true,
        operator: 'JK',
        machine: 'D1',
        jobInProgress: true,
        standardPack: 100,
        boxes: 3,
        partialBoxQuantity: 17,
        objectList: [
            {
                serial: 5555123,
                quantity: 100,
                partial: false,
            },
            {
                serial: 5555124,
                quantity: 100,
                partial: false,
            },
            {
                serial: 5555125,
                quantity: 100,
                partial: false,
            },
            {
                serial: 5555126,
                quantity: 17,
                partial: true,
            },
        ],
    },
];
