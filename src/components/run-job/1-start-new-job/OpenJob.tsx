import { useAppDispatch } from '../../../app/hooks';
import { Button } from '../../../bootstrap';
import {
    IPackingJob,
    openPackingJobAsync,
} from '../../../features/packingJob/packingJobSlice';

export function OpenJob(props: { packingJob: IPackingJob }) {
    const dispatch = useAppDispatch();

    function startJobHandler(): void {
        if (!props.packingJob.demoJob) dispatch(openPackingJobAsync());
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
