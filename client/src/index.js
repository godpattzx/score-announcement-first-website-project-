// AppRouter.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ContextProvider } from "./Auth/AuthContext";
import LandingPage from "./web_page/LandingPage";
import LoginForm from "./login/loginPage";
import App from "./App";
import HomeS from "./web_page/homeS";
import LoginRedirect from "./login/LoginRedirect";
import ScoreManagement from "./web_page/ScoreManagement";
import PrivateRoute from "./Auth/PrivateRouteForStaff";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/student/*" element={<App />} />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/staff/*"
          element={<PrivateRoute element={<HomeS />} roles={["Staff"]} />}
        />
        
        <Route path="/connect/google/redirect" element={<LoginRedirect />} />
        <Route
          path="/score-management/:subjectName"
          element={<ScoreManagement />}
        />
      </Routes>
    </Router>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(
  <ContextProvider>
    <React.StrictMode>
      <AppRouter />
    </React.StrictMode>
  </ContextProvider>
);
