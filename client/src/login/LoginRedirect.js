import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";  // Change here

const backendUrl = "http://localhost:1337";

const LoginRedirect = () => {
  const [text, setText] = useState("Loading...");
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();  // Change here

  useEffect(() => {
    const providerName = "google"; // Set the provider name here (e.g., 'google')

    fetch(`${backendUrl}/api/auth/${providerName}/callback${location.search}`)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error(`Couldn't login to Strapi. Status: ${res.status}`);
        }
        return res;
      })
      .then((res) => res.json())
      .then((res) => {
        // Successfully logged in with Strapi
        // Save the jwt for future authenticated requests to Strapi
        localStorage.setItem("jwt", res.jwt);
        localStorage.setItem("username", res.user.username);
        setText(
          "You have been successfully logged in. You will be redirected in a few seconds..."
        );

        // Redirect to homepage after 3 seconds
        setTimeout(() => navigate("/"), 3000);  // Change here
      })
      .catch((err) => {
        console.log(err);
        setText("An error occurred, please see the developer console.");
      });
  }, [navigate, location.search]);  // Change here

  return <p>{text}</p>;
};

export default LoginRedirect;
