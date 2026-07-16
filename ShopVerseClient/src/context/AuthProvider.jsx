import { useReducer, useEffect, useState } from "react"; // 1. Import useState

import AuthContext from "./AuthContext";
import { authReducer, initialState } from "./AuthReducer";

import { axiosInstance } from "../services/api";

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // 2. Add dynamic modal state globally inside context
  const [showLogin, setShowLogin] = useState(false);

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
        showLogin,       // 3. Expose state
        setShowLogin,    // 4. Expose modifier function
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;