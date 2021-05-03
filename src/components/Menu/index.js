import { useState, useEffect } from "react";
import { Navbar, NavDropdown, Container, Button } from "react-bootstrap";
import { AmplifySignOut } from "@aws-amplify/ui-react";
import AuthService from "../../services/AuthService";
import { API } from "aws-amplify";
import * as mutations from "../../graphql/mutations";
import { toast } from "react-toastify";

import "./styles.css";

const Menu = () => {
  const [name, setName] = useState("");
  const [disableButtonLog, setDisableButtonLog] = useState(false);

  const sendEmailLogs = async () => {
    setDisableButtonLog(true);

    const sendEmail = await API.graphql({
      query: mutations.sendActionHistoryEmail,
    });

    if (sendEmail.data.sendActionHistoryEmail)
      toast.success("E-mail enviado com sucesso.");
    else toast.error("Erro ao enviar o e-mail");

    setDisableButtonLog(false);
  };

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
          title={<span className="text-white">{name}</span>}
          id="nav-dropdown"
          className="dropdown-menu-right"
        >
          <NavDropdown.Item eventKey="1">
            <Button
              variant="link"
              size="sm"
              disabled={disableButtonLog}
              onClick={() => sendEmailLogs()}
            >
              Enviar log de ações.
            </Button>
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item eventKey="2">
            <AmplifySignOut />
          </NavDropdown.Item>
        </NavDropdown>
      </Container>
    </Navbar>
  );
};

export default Menu;
