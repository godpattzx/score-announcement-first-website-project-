// SimpleLoginForm.js
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
//import { GoogleLogin } from 'react-google-login';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import axiosConfig from "../axios-interceptor";
import "./loginPage.css";
import BackgroundImage from "../image/image-from-rawpixel-id-2909890-jpeg.jpg";
import Logo from "../image/psu1.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { jwtDecode } from "jwt-decode";

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitEnabled, setSubmitEnabled] = useState(true);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoggingInWithGoogle, setIsLoggingInWithGoogle] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitEnabled(false);
    setLoading(true);

    try {
      let result = await axios.post("http://localhost:1337/api/auth/local", {
        identifier: username,
        password: password,
      });
      axiosConfig.jwt = result.data.jwt;
      localStorage.setItem("authToken", result.data.jwt);

      result = await axios.get(
        "http://localhost:1337/api/users/me?populate=role"
      );
      if (result.data.role) {
        if (result.data.role.name === "Student") {
          navigate("/student");
        } else if (result.data.role.name === "Staff") {
          navigate("/staff");
        }
        setLoading(false);
        toast.success("Login success!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "colored",
        });
        console.log("User Information:", result.data);
      }
    } catch (e) {
      console.log(e);
      console.log("wrong username & password");
      setShow(true);
    } finally {
      setLoading(false);
      setSubmitEnabled(true);
    }
  };
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const decodedToken = jwtDecode(credentialResponse?.credential);
      console.log(decodedToken);

      // Register the user in Strapi using Axios
      await axios.post("http://localhost:1337/auth/local/register", {
        username: decodedToken.email,
        email: decodedToken.email,
        password: `${decodedToken.sub}${decodedToken.jti}`, // You may want to generate a more secure password
      });

      // Redirect or perform other actions after successful registration
      window.location.href = "/"; // Redirect to the home page, for example
    } catch (error) {
      console.error("Error processing Google login:", error);
    }
  };
  const handleGoogleLoginClick = () => {
    // Redirect the user to the Google OAuth 2.0 page
    window.location.href = "http://localhost:1337/api/connect/google"; // Replace with your actual backend URL
  };

  return (
    <GoogleOAuthProvider clientId="956646024955-8m429gqtoufr4e2lgri7p9kjmjlpaf53.apps.googleusercontent.com">
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
          ) : null}
          <Form.Group className="mb-2" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              placeholder="Username"
              onChange={handleUsernameChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              placeholder="Password"
              onChange={handlePasswordChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="checkbox">
            <Form.Check type="checkbox" label="Remember me" />
          </Form.Group>
          {!loading ? (
            <Button
              className="w-100"
              variant="primary"
              type="submit"
              disabled={!submitEnabled}
            >
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
              onClick={() => navigate("/student")}
            >
              Guest Login
            </Button>
          </div>
          <div className="divider d-flex align-items-center ">
            <p className="text-center mx-3 mb-0">Or</p>
          </div>
          <div className="d-grid justify-content-center">
            {
              <button onClick={handleGoogleLoginClick}>
                Login with Google
              </button>
            }
          </div>
        </Form>
        {/* Footer */}
        <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
          pann-project | &copy;2024
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginForm;
