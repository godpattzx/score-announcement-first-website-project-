import React, { useState, useContext } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./loginPage.css";
import BackgroundImage from "../image/image-from-rawpixel-id-2909890-jpeg.jpg";
import Logo from "../image/psu1.png";
import "bootstrap/dist/css/bootstrap.min.css";
import conf from "../conf/main";
import ax from '../conf/ax';

import { AuthContext, ContextProvider } from "../Auth/AuthContext";


const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitEnabled, setSubmitEnabled] = useState(true);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


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
  
    login(username, password); 


    try {
      let result = await ax.post(`${conf.apiUrlPrefix}${conf.loginEndpoint}`, {
        identifier: username,
        password: password,
      }); 
      result = await ax.get(`${conf.apiUrlPrefix}${conf.jwtUserRoleEndpoint}`);
      console.log(result.data.role.name);
      if (result?.data) {
        if (result?.data?.role?.name === "Student") {
          navigate("/student");
        } else if (result?.data?.role?.name === "Staff") {
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
    
      } else {
  
      }
    } catch (e) {
      console.error(e);
      console.log("Wrong username & password");
      setShow(true);
    } finally {
      setLoading(false);
      setSubmitEnabled(true);
    }
  };

  const handleGoogleLoginClick = () => {
    window.location.href = `${conf.apiUrlPrefix}${conf.googleConnectEndpoint}`;
  };

  return (
    <ContextProvider>
      <div
        className="sign-in__wrapper "
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              className="login-with-google-btn "
              onClick={handleGoogleLoginClick}
            >
              Sign in with Google
            </button>
          </div>
        </Form>
      
        <div
          className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center"
          disabled
        >
          pann-project | &copy;2024
        </div>
      </div>
    </ContextProvider>
  );
};

export default LoginForm;
