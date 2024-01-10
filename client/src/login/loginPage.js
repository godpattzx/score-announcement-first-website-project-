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
import { GoogleLogin } from 'react-google-login';

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitEnabled, setSubmitEnabled] = useState(true);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const clientId = "447030836033-m5vcgu9ju36an4onbb5tipfdlntekhs1.apps.googleusercontent.com";

  const onSuccess = (res) => {
    console.log('Success', res);

    const googleIdToken = res.tokenId;
    localStorage.setItem("googleAuthToken", googleIdToken);

    navigate("/student");
  };

  const onFailure = (res) => {
    console.log('failed', res);
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
    // ... (rest of the code for login using email/password)
  };

  return (
    <div className="sign-in__wrapper" style={{ backgroundImage: `url(${BackgroundImage})` }}>
      <div className="sign-in__backdrop"></div>
      <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
        <img className="img-thumbnail mx-auto d-block mb-2" src={Logo} alt="logo" />
        <div className="h4 mb-2 text-center">Sign In</div>
        {show ? (
          <Alert className="mb-2" variant="danger" onClose={() => setShow(false)} dismissible>
            Incorrect username or password.
          </Alert>
        ) : (
          <div />
        )}
        {/* ... (rest of the login form) */}
        <GoogleLogin
          clientId={clientId}
          buttonText="Sign in with Google"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={'single_host_origin'}
          isSignedIn={true}
        />
      </Form>
      <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
        pann-project | &copy;2024
      </div>
    </div>
  );
};

export default LoginForm;
