import { useReducer, useEffect } from "react";

import AuthContext from "./AuthContext";
import { authReducer, initialState } from "./AuthReducer";

import { axiosInstance } from "../services/api";

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.token) {
      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${state.token}`;
    } else {
      delete axiosInstance.defaults.headers.common["Authorization"];
    }
  }, [state.token]);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
