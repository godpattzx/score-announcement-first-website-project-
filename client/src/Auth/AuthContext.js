// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
  
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role"); 

    if (storedAuth && storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
      setRole(storedRole);
    }
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData.username);
    setRole(userData.role.name);
    console.log('AuthContext Check : ',userData);
 
  
    localStorage.setItem("isAuthenticated", true);
    localStorage.setItem("user", userData.username);
    localStorage.setItem("role", userData.role.name); 
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);


    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("authToken")
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login,role, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
