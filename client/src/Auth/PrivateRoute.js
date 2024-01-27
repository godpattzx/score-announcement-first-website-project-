// PrivateRoute.js
import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ element, roles }) => {
  const { state } = useContext(AuthContext);

  const isAuthorized = state.isLoggedIn && roles.includes(state.user?.role?.name);

  return isAuthorized ? <Route element={element} /> : <Navigate to="/student" />;
};

export default PrivateRoute;
