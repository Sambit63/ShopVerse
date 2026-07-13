import React, { useState, useContext } from "react";
import "./Login.css";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaTimes,
} from "react-icons/fa";

import UserService from "../../services/UserService";
import AuthContext from "../../context/AuthContext";

const Login = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

//   const { dispatch } = useContext(AuthContext);
const auth = useContext(AuthContext);
const { dispatch } = auth || {};

  const loginUser = async () => {
    try {
      const response = await UserService.login({
        email,

        password,
      });

      console.log(response.data);

      dispatch({
        type: "LOGIN",

        payload: response.data,
      });

      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="login-header">
          <h1>ShopVerse</h1>
          <h2>Welcome Back 👋</h2>
          <p>Login to continue shopping with us.</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="input-group">
            <FaEnvelope className="input-icon" />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="login-options">
            <label>
              <input type="checkbox" />
              Remember Me
            </label>

            <a href="/">Forgot Password?</a>
          </div>

          <button type="submit" className="login-btn" onClick={loginUser}>
            Login
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button className="google-btn">
          <FaGoogle />
          Continue with Google
        </button>

        <p className="register-text">
          Don't have an account?
          <span> Register</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
