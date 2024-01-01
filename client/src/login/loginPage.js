// SimpleLoginForm.js
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import axiosConfig from "../axios-interceptor";
import { useNavigate } from "react-router-dom";
import "./loginPage.css";
import BackgroundImage from "../image/image-from-rawpixel-id-2909890-jpeg.jpg";
import Logo from "../image/psu1.png";
import "bootstrap/dist/css/bootstrap.min.css"


const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitEnabled, setSubmitEnabled] = useState(true);

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleGuestLogin = (e) => {
    navigate("/student");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   setSubmitEnabled(false);
    setLoading(true);
    await delay(500);

    try {
      let result = await axios.post("http://localhost:1337/api/auth/local", {
        identifier: username,
        password: password,
      });
      axiosConfig.jwt = result.data.jwt;
      localStorage.setItem("authToken", result.data.jwt);
      setSubmitEnabled(true);
      
      

      result = await axios.get(
        "http://localhost:1337/api/users/me?populate=role"
        
      );
      if (result.data.role) {
        if (result.data.role.name === "Student") {
          navigate("/student");
        }
        else if(result.data.role.name === "Staff") {
          navigate("/student");
        }
        setLoading(false);
        
      
      }

      console.log(result);
    } catch (e) {
      console.log(e);
      console.log("wrong username & password");
      
      setShow(true);
    
    }
    finally {
      
      setLoading(false);
    }
    
  
  };
  const handlePassword = () => {};

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  return (
    
    <div
    className="sign-in__wrapper"
    style={{ backgroundImage: `url(${BackgroundImage})` }}
  >
    {/* Overlay */}
    <div className="sign-in__backdrop"></div>
    {/* Form */}
    <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
      {/* Header */}
      <img
        className="img-thumbnail mx-auto d-block mb-2"
        src={Logo}
        alt="logo"
      />
      <div className="h4 mb-2 text-center">Sign In</div>
      {/* ALert */}
      {show ? (
        <Alert
          className="mb-2"
          variant="danger"
          onClose={() => setShow(false)}
          dismissible
        >
          Incorrect username or password.
        </Alert>
      ) : (
        <div />
      )}
      <Form.Group className="mb-2" controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-2" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-2" controlId="checkbox">
        <Form.Check type="checkbox" label="Remember me" />
      </Form.Group>
      {!loading ? (
        <Button className="w-100" variant="primary" type="submit">
          Log In
        </Button>
      ) : (
        <Button className="w-100" variant="primary" type="submit" disabled>
          Logging In...
        </Button>
      )}
      <div className="d-grid justify-content-end">
        <Button
          className="text-muted px-0"
          variant="link"
         
          
          onClick={handleGuestLogin}
        >
          Guest Login
        </Button>
      </div>
    </Form>
    {/* Footer */}
    <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
      pann-project | &copy;2024
    </div>
  </div>
);
};

export default LoginForm;
