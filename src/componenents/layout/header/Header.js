import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Header = () => {
    return (
        <>
            <Navbar bg="primary" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Acceui</Nav.Link>
                        <Nav.Link href="#features">Mes publication</Nav.Link>
                    </Nav>
                    <NavDropdown title="User" id="basic-nav-dropdown" className='text-white'>
                        <NavDropdown.Item href="#action/3.1">Deconnexion</NavDropdown.Item>
                    </NavDropdown>
                </Container>
            </Navbar>

        </>
    )
}

export default Header