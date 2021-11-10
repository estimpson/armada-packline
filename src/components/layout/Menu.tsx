import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Container } from '../../bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { logo } from '../../App';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
    IIdentity,
    logout,
    selectIdentity,
} from '../../features/identity/identitySlice';

export function MainMenu(prop: { closeAction?: () => void }) {
    const identity: IIdentity = useAppSelector(selectIdentity);
    const dispatch = useAppDispatch();

    return (
        <Container
            fluid
            className="bg-dark flex-grow-0 d-flex flex-row flex-nowrap p-0"
        >
            <Navbar
                bg="dark"
                variant="dark"
                expand="sm"
                sticky="top"
                className="w-100"
            >
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <img
                            alt=""
                            src={logo}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        Fx Pack Line
                    </Navbar.Brand>
                    {identity.userName && (
                        <>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto">
                                    <Nav.Link as={Link} to="/jobs-demo">
                                        Jobs Demo
                                    </Nav.Link>
                                    <Nav.Link as={Link} to="/printers">
                                        Printers
                                    </Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                        </>
                    )}
                </Container>
            </Navbar>
            {identity.userName && (
                <>
                    <Button
                        type="button"
                        className="d-flex flex-nowrap align-items-center my-auto me-2 py-1 btn btn-sm btn-outline-info text-white"
                        onClick={() => dispatch(logout())}
                    >
                        <span className="fs-2 me-2">{identity.userCode}</span>
                        <FontAwesomeIcon icon={faUser} size="2x" />
                    </Button>
                </>
            )}
            {prop.closeAction && (
                <button
                    type="button"
                    className="btn-close btn-close-white mx-0 position-top p-2"
                    aria-label="Close"
                    onClick={prop.closeAction}
                ></button>
            )}
        </Container>
    );
}
