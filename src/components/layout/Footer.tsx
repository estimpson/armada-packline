import { Container } from 'react-bootstrap';

export function Footer() {
    return (
        <Container fluid as="footer" className="footer mt-auto px-0">
            <Container
                fluid
                className="mt-5 px-5 pt-2 pb-1 bg-light text-muted d-flex justify-content-between"
            >
                <p className="m-0">
                    © {new Date().getFullYear()} Fore-Thought, LLC
                </p>
                <p className="m-0">
                    <a
                        href="https://www.fxsupplierportal.com/"
                        className="text-decoration-none text-reset"
                    >
                        FxSupplierPortal.com
                    </a>
                </p>
            </Container>
        </Container>
    );
}
