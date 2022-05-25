import { useAppDispatch } from '../../../app/hooks';
import { Button } from '../../../bootstrap';
import {
    IPackingJob,
    openPackingJobAsync,
} from '../../../features/packingJob/packingJobSlice';
import { getPartialBoxListAsync } from '../../../features/partialBox/partialBoxListSlice';

export function OpenJob(props: { packingJob: IPackingJob }) {
    const dispatch = useAppDispatch();

    function startJobHandler(): void {
        if (!props.packingJob.demoJob) {
            dispatch(openPackingJobAsync());
            dispatch(getPartialBoxListAsync(props.packingJob.part!.partCode));
        }
    }
    return (
        <>
            <Button
                onClick={() => {
                    startJobHandler();
                }}
            >
                Open Job
            </Button>
        </>
    );
}
