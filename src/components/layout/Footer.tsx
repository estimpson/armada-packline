import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectApiDetails } from '../../features/localApi/localApiSlice';

export function Footer() {
    const apiDetails = useSelector(selectApiDetails);
    return (
        <Container fluid as="footer" className={'footer mt-auto px-0'}>
            <Container
                fluid
                className={
                    (apiDetails.port
                        ? 'bg-light text-muted '
                        : 'text-white bg-danger ') +
                    'px-5 pt-2 pb-1 d-flex justify-content-between fs-6'
                }
            >
                <p className="m-0">
                    © {new Date().getFullYear()} Fore-Thought, LLC
                </p>
                <p className="m-0">
                    <a href="/" className="text-decoration-none text-reset">
                        Fx Pack Line (
                        {apiDetails.port ? 'Ready' : 'Awaiting API'})
                    </a>
                </p>
            </Container>
        </Container>
    );
}
