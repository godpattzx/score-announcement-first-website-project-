import React from "react";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route,  } from "react-router-dom";
import { createRoot } from "react-dom/client";

import LandingPage from "./web_page/LandingPage";
import LoginForm from "./login/loginPage";
import App from "./App";
import HomeS from "./web_page/homeS";
import LoginRedirect from "./login/LoginRedirect";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ScoreManagement from "./web_page/ScoreManagement";
import { ContextProvider } from "./Auth/AuthContext";
import PrivateRoute from "./Auth/PrivateRoute";

const AppRouter = () => {
  return (
    <ContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/student/*" element={<App />} /> 
          <Route path="/login" element={<LoginForm />} />
          <Route path="/staff" element={<PrivateRoute element={<HomeS />} roles={['Staff']} />} />
          <Route path="/connect/google/redirect" element={<LoginRedirect />} />
          <Route path="/score-management/:subjectName" element={<ScoreManagement />} />
        </Routes>
      </Router>
    </ContextProvider>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
