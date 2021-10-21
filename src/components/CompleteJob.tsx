import { Button } from '../bootstrap';

export function CompleteJob(props: { completeJobHandler?: () => void }) {
    return (
        <>
            {' '}
            <Button
                onClick={() => {
                    props.completeJobHandler && props.completeJobHandler();
                }}
            >
                Complete Job
            </Button>
        </>
    );
}
