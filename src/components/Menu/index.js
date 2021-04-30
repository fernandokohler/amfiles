import { useState, useEffect } from "react";
import { Navbar, NavDropdown, Container } from "react-bootstrap";
import { AmplifySignOut } from "@aws-amplify/ui-react";
import AuthService from "../../services/AuthService";
import "./styles.css";

const Menu = () => {
  const [name, setName] = useState("");

  useEffect(() => {
    const getCurrentUser = async () => {
      const currentUser = await AuthService.currentUser();
      setName(currentUser.attributes.name);
    };
    getCurrentUser();
  }, []);

  return (
    <Navbar bg="primary" variant="dark" className="navbar-content">
      <Container>
        <Navbar.Brand href="/">
          <span>AM</span>
          <small>Files</small>
        </Navbar.Brand>
        <NavDropdown
          title={name}
          id="nav-dropdown"
          className="dropdown-menu-right"
        >
          <NavDropdown.Divider />
          <NavDropdown.Item eventKey="4.4">
            <AmplifySignOut />
          </NavDropdown.Item>
        </NavDropdown>
      </Container>
    </Navbar>
  );
};

export default Menu;
