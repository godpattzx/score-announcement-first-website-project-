import React, { useState, useEffect } from "react";
import { Navbar, Nav, Button, Modal } from "react-bootstrap";
import axios from "axios";
import "./navbar.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NavigationBar = () => {
  const [userData, setUserData] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleShowLogoutModal = () => setShowLogoutModal(true);
  const handleCloseLogoutModal = () => setShowLogoutModal(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");

        if (authToken) {
          const response = await axios.get(
            "http://localhost:1337/api/users/me?populate=role",
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          setUserData(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  return (
    <>
      <Navbar expand="lg">
        <Navbar.Brand href="/student">Score-Announcement</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="/student">Home</Nav.Link>
            {userData ? (
              userData.role && userData.role.type === "staff" ? (
                <Nav.Link href="/staff">Staff Management</Nav.Link>
              ) : (
                <></>
              )
            ) : null
             
            }
          </Nav>
          <Nav className="right-align">
            {userData ? (
              <>
                <Navbar.Text className="mr-5 sign-in-as">
                  Sign in as: {userData.username}
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
