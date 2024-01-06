import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link
} from "react-router-dom";

import LandingPage from './web_page/LandingPage';
import LoginForm from './login/loginPage';
import App from './App';
import HomeS from './homeS';


const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <LandingPage/>,
  },
  {
    path: "/student",
    element: <App/>,
  },
  {
    path: "/login",
    element: <LoginForm/>,
  },
  {
    path: "/staff",
    element: <HomeS/>,
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
