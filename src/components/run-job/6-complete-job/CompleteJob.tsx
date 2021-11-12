import { useAppDispatch } from '../../../app/hooks';
import { Button } from '../../../bootstrap';
import {
    completeJob,
    IPackingJob,
} from '../../../features/packingJob/packingJobSlice';

export function CompleteJob(props: { packingJob: IPackingJob }) {
    const dispatch = useAppDispatch();

    function completeJobHandler(): void {
        if (!props.packingJob.demoJob) dispatch(completeJob());
    }

    return (
        <>
            <Button
                onClick={() => {
                    completeJobHandler();
                }}
            >
                Complete Job
            </Button>
        </>
    );
}
