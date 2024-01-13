// SimpleLoginForm.js
import React, { useEffect, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import axiosConfig from "../axios-interceptor";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./loginPage.css";
import BackgroundImage from "../image/image-from-rawpixel-id-2909890-jpeg.jpg";
import Logo from "../image/psu1.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoogleLogin,GoogleLogout } from 'react-google-login'
import { gapi } from 'gapi-script'

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitEnabled, setSubmitEnabled] = useState(true);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState([]);
  const clientId = "447030836033-m5vcgu9ju36an4onbb5tipfdlntekhs1.apps.googleusercontent.com"
  
  useEffect(() =>{
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        score: ''
      })
    }
    gapi.load("client:auth2", initClient)
  },[]);



  const logOut = () => {
    setProfile(null);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleGuestLogin = (e) => {
    navigate("/student"); 
    toast.warn('Please log in to access the guest account.', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "colored",
      });
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
        } else if (result.data.role.name === "Staff") {
          navigate("/student");
        }
        setLoading(false);
        toast.success('Login success!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "colored",
          });
      }
    } catch (e) {
      console.log(e);
      console.log("wrong username & password");
      setShow(true);
    } finally {
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
 
      <div className="sign-in__backdrop"></div>
  
      <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
      
        <img
          className="img-thumbnail mx-auto d-block mb-2"
          src={Logo}
          alt="logo"
        />
        <div className="h4 mb-2 text-center">Sign In</div>
    
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
        <GoogleLogin
          clientId={clientId}
          buttonText="Sign in with Google"
  
          cookiePolicy={'single_host_origin'}
          isSignedIn= {true}
        />
      </Form>
      {/* Footer */}
      <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
        pann-project | &copy;2024
      </div>
    </div>
  );
};

export default LoginForm;
