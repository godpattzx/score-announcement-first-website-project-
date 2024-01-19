import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client'; // Updated import statement

import LandingPage from './web_page/LandingPage';
import LoginForm from './login/loginPage';
import App from './App';
import HomeS from './homeS';
import LoginRedirect from './login/LoginRedirect';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/student" element={<App />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/staff" element={<HomeS />} />
        <Route path="/connect/google/redirect" element={<LoginRedirect />} />
      </Routes>
    </Router>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
