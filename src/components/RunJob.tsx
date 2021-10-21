import { IPackingJob } from '../features/packingJob/packingJobSlice';
import { IPart } from '../features/part/partSlice';
import { BeginJobSummary } from './BeginJobSummary';
import { CompleteJob } from './CompleteJob';
import { JobInventory } from './JobInventory';
import { LotQuantity } from './LotQuantity';
import { LotQuantitySummary } from './LotQuantitySummary';
import { StartNewJob } from './StartNewJob';

export function RunJob(props: {
    step?: string;
    packingJob: IPackingJob;

    partChangeHandler?: (part: IPart | undefined) => void;
    acknowledgementHandler?: (acknowledged: boolean) => void;
    pieceWeightQuantityHandler?: (pieceWeight: number | undefined) => void;
    pieceWeightHandler?: (pieceWeight: number | undefined) => void;
    operatorHandler?: (operator: string) => void;
    machineHandler?: (machine: string) => void;
    startJobHandler?: () => void;
    boxesHandler?: (boxes: number) => void;
    partialBoxQuantityHandler?: (partialBoxQuantity: number) => void;
    stopJobHandler?: () => void;
    generateInventoryHandler?: () => void;
    resetInventoryHandler?: () => void;
    deleteBoxHandler?: (serial: number) => void;
    printLabelsHandler?: () => void;
    combinePartialBoxHandler?: (scanData: string) => void;
    completeJobHandler?: () => void;
}) {
    return (
        <>
            {props.step && <p className="fs-5">{props.step}</p>}
            {!props.packingJob.jobInProgress ? (
                <StartNewJob
                    part={props.packingJob.part}
                    partSetter={props.partChangeHandler}
                    acknowledged={props.packingJob.acknowledged}
                    acknowledgementHandler={props.acknowledgementHandler}
                    quantity={props.packingJob.quantity}
                    pieceWeight={props.packingJob.pieceWeight}
                    pieceWeightQuantityHandler={
                        props.pieceWeightQuantityHandler
                    }
                    pieceWeightHandler={props.pieceWeightHandler}
                    validPieceWeight={props.packingJob.validPieceWeight}
                    operator={props.packingJob.operator}
                    machine={props.packingJob.machine}
                    operatorHandler={props.operatorHandler}
                    machineHandler={props.machineHandler}
                    startJobHandler={props.startJobHandler}
                />
            ) : (
                <BeginJobSummary
                    part={props.packingJob.part}
                    instructions={props.packingJob.instructions}
                    acknowledged={props.packingJob.acknowledged}
                    quantity={props.packingJob.quantity}
                    pieceWeight={props.packingJob.pieceWeight}
                    validPieceWeight={props.packingJob.validPieceWeight}
                    operator={props.packingJob.operator}
                    machine={props.packingJob.machine}
                    objectList={props.packingJob.objectList}
                    stopJobHandler={props.stopJobHandler}
                />
            )}
            {props.packingJob.jobInProgress &&
                (!props.packingJob.objectList?.length ? (
                    <LotQuantity
                        part={props.packingJob.part!}
                        boxes={props.packingJob.boxes}
                        boxesHandler={props.boxesHandler}
                        partialBoxQuantity={props.packingJob.partialBoxQuantity}
                        partialBoxQuantityHandler={
                            props.partialBoxQuantityHandler
                        }
                        generateInventoryHandler={
                            props.generateInventoryHandler
                        }
                    />
                ) : (
                    <>
                        <LotQuantitySummary
                            part={props.packingJob.part!}
                            boxes={props.packingJob.boxes}
                            partialBoxQuantity={
                                props.packingJob.partialBoxQuantity
                            }
                        />
                        <JobInventory
                            part={props.packingJob.part!}
                            objectList={props.packingJob.objectList}
                            deleteBoxHandler={props.deleteBoxHandler}
                            resetInventoryHandler={props.resetInventoryHandler}
                            printLabelsHandler={props.printLabelsHandler}
                            combinePartialBoxHandler={
                                props.combinePartialBoxHandler
                            }
                        />
                        {props.packingJob.objectList.filter(
                            (object) => !object.printed,
                        ).length ? (
                            <></>
                        ) : (
                            <CompleteJob
                                completeJobHandler={props.completeJobHandler}
                            />
                        )}
                    </>
                ))}
        </>
    );
}
