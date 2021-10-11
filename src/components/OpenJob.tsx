import { Button } from '../bootstrap';

export function OpenJob(props: { startJobHandler?: () => void }) {
    return (
        <>
            <Button
                onClick={() => {
                    if (props.startJobHandler) props.startJobHandler();
                }}
            >
                Open Job
            </Button>
        </>
    );
}
