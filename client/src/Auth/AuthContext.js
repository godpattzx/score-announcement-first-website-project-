import React, { useEffect } from "react";
import { useSetState } from "react-use";
import conf from "../conf/main";
import ax, { axData } from "../conf/ax";

export const AuthContext = React.createContext(null);

const initialState = {
  isLoggedIn: false,
  user: null,
  isLoginPending: false,
  loginError: null,
};

const updateJwt = (jwt) => {
  axData.jwt = jwt;
  if (jwt) {
    sessionStorage.setItem(conf.jwtSessionStorageKey, jwt);
  } else {
    sessionStorage.removeItem(conf.jwtSessionStorageKey);
  }
};

export const ContextProvider = (props) => {
  const [state, setState] = useSetState(initialState);

  const setLoginPending = (isLoginPending) => setState({ isLoginPending });
  const setLoginSuccess = (isLoggedIn, user) => setState({ isLoggedIn, user });
  const setLoginError = (loginError) => setState({ loginError });

  const handleLoginResult = (error, result) => {
    setLoginPending(false);

    if (result && result.user) {
      if (result.jwt) {
        updateJwt(result.jwt);
      }
      setLoginSuccess(true, result.user);
      console.log(
        "User Information:",
        result.user.username,
        result.user.role.name
      );
    } else if (error) {
      setLoginError(error);
    }
  };

  useEffect(() => {
    setLoginPending(true);
    loadPersistedJwt(handleLoginResult);
  }, []);

  const login = async (username, password) => {
    setLoginPending(true);
    setLoginSuccess(false);
    setLoginError(null);

    try {
      const response = await ax.post(conf.loginEndpoint, {
        identifier: username,
        password: password,
      });

      if (response.data.jwt && response.data.user.id > 0) {
        updateJwt(response.data.jwt);
        setLoginSuccess(true, response.data.user);
      } else {
        throw new Error("Invalid username and password");
      }
    } catch (error) {
      setLoginError(new Error("Failed to initiate login"));
    }
  };

  const logout = () => {
    setLoginPending(false);
    updateJwt(null);
    setLoginSuccess(false);
    setLoginError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

const loadPersistedJwt = async (callback) => {
  try {
    const persistedJwt = sessionStorage.getItem(conf.jwtSessionStorageKey);
    if (persistedJwt) {
      axData.jwt = persistedJwt;
      const response = await ax.get(conf.jwtUserRoleEndpoint);
      if (response.data.id > 0) {
        callback(null, { user: response.data });
      } else {
        updateJwt(null);
        callback(null);
      }
    } else {
      callback(null);
    }
  } catch (error) {
    console.error("Error during auto login:", error);
    updateJwt(null);
    callback(new Error("Failed to initiate auto login"));
  }
};

export default ContextProvider;
