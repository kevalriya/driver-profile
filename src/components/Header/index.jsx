import React from "react";
import { Navbar, Nav } from "react-bootstrap";

const redirectToOrigin = () => {
  window.location.href = "https://portlmedia.com/";
};

const Header = props => {
  return (
    <Navbar className="navbarHeader" collapseOnSelect expand="lg" bg="white" variant="light">
      <img className="portlLogo"
      src="https://portl-client-microsites.s3.amazonaws.com/porttllogo.png"
      alt="portl logo"
      onClick={redirectToOrigin}
      />
      <Navbar.Text className="navbarText">
        <h1 className="headerText">{props.title}</h1>
      </Navbar.Text>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse className="navbarCollapse" id="responsive-navbar-nav">
        <Nav>
          <Nav.Link href="/profile#">Profile</Nav.Link>
          <Nav.Link href="/settings#">Settings</Nav.Link>
          <Nav.Link href="/leaderboard#">Leader Board</Nav.Link>
          <Nav.Link href="/about#">About</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
