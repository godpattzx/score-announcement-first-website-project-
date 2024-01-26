import React, { useState, useContext } from "react";
import { Navbar, Nav, Button, Modal } from "react-bootstrap";
import "./navbar.css";
import "react-toastify/dist/ReactToastify.css";
import logo from "../image/PSU Logo-01.png";
import { AuthContext } from '../Auth/AuthContext';

const NavigationBar = () => { 
  const { state: ContextState, logout } = useContext(AuthContext);
  const { user } = ContextState;
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleShowLogoutModal = () => setShowLogoutModal(true);
  const handleCloseLogoutModal = () => setShowLogoutModal(false);

  const handleLogout = () => {
    logout();
    handleCloseLogoutModal();
    window.location.href = "/login";
  };

  return (
    <>
      <Navbar expand="lg">
        <Navbar.Brand href="/student">
          <img
            src={logo}
            alt="Your Logo Alt Text"
            className="d-inline-block align-top"
            style={{ maxHeight: "45px" }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="/student">Home</Nav.Link>
            {user?.role?.name === "Staff" ? (
              <Nav.Link href="/staff">Staff Management</Nav.Link>
            ) : null}
          </Nav>
          <Nav className="right-align">
            { user?.role ? (
              <>
                <Navbar.Text className="mr-5 sign-in-as">
                  Sign in as: {user?.username} ({user?.role?.name})
                </Navbar.Text>
                <Button
                  variant="outline-danger"
                  className="ml-5 button"
                  onClick={handleShowLogoutModal}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                className="mr-10 button"
                variant="outline-primary"
                href="/login"
              >
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Modal show={showLogoutModal} onHide={handleCloseLogoutModal}>
        <Modal.Header closeButton>
          <Modal.Title>Logout Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLogoutModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NavigationBar;
