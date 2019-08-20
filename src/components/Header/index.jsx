import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

const redirectToOrigin = () => {
    window.location.href = "https://portlmedia.com/";
}

const Header = (props) => {
    return (
            <div className="header">
                <img
                    className="portlLogo"
                    src="https://portl-client-microsites.s3.amazonaws.com/porttllogo.png"
                    alt="portl logo"
                    onClick={redirectToOrigin}
                />
                <h1 className="headerText">{props.title}</h1>
                <Navbar className="navBar" collapseOnSelect expand="xl" bg="white" variant="light">
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" style={{outline: "none"}} />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav>
                            <Nav.Link href="/profile">Profile</Nav.Link>
                            <Nav.Link href="/settings">Settings</Nav.Link>
                            <Nav.Link href="/leaderboard">Leader-Board</Nav.Link>
                            <Nav.Link href="/about">About</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
}

export default Header