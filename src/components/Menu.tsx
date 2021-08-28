import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { IIdentity, selectIdentity } from '../features/identity/identitySlice';

export function MainMenu() {
    const identity: IIdentity = useAppSelector(selectIdentity);

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Aztec Supplier Portal
                </Navbar.Brand>
                {identity.userName && (
                    <>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link as={Link} to="/generate-inventory">
                                    Generate Inventory
                                </Nav.Link>
                                <Nav.Link as={Link} to="/reprint-labels">
                                    Reprint Labels
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
    );
}
