import { IRecentPieceWeight } from '../recentPieceWeightSlice';

export const DemoRecentPieceWeightes: Array<{
    partCode: string;
    recentPieceWeightList: IRecentPieceWeight[];
}> = [
    {
        partCode: 'XXX',

        recentPieceWeightList: [
            {
                pieceWeight: 123,
                rowID: 1,
            },
            {
                pieceWeight: 1.23,
                rowID: 2,
            },
        ],
    },
    {
        partCode: 'YYY',

        recentPieceWeightList: [
            {
                pieceWeight: 0.01,
                rowID: 3,
            },
            {
                pieceWeight: 0.02,
                rowID: 4,
            },
        ],
    },
];
