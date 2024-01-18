import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import LandingPage from './web_page/LandingPage';
import LoginForm from './login/loginPage';
import App from './App';
import HomeS from './homeS';
import LoginRedirect from './login/LoginRedirect';

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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
