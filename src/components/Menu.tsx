import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Switch, Route, Link } from 'react-router-dom';

export function MainMenu() {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Aztec Supplier Portal
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/generate-inventory">
                            Generate Inventory
                        </Nav.Link>
                        <Nav.Link as={Link} to="/reprint-labels">
                            Reprint Labels
                        </Nav.Link>
                        <Nav.Link as={Link} to="/generate-asn">
                            Generate ASN
                        </Nav.Link>
                        <Nav.Link as={Link} to="/printers">
                            Printers
                        </Nav.Link>
                        <NavDropdown
                            title="Supplier Settings"
                            id="basic-nav-dropdown"
                        >
                            <NavDropdown.Item as={Link} to="/supplier-settings">
                                Settings
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">
                                Another action
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">
                                Something
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                                Separated link
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
