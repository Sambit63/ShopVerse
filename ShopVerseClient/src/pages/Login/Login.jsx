import React, { useState, useContext } from "react";
import "./Login.css";
import toast from "react-hot-toast";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaTimes,
  FaUser,
} from "react-icons/fa";

import UserService from "../../services/UserService";
import AuthContext from "../../context/AuthContext";

const Login = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true); // Tracks whether to show Login or Register
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = useContext(AuthContext);
  const { dispatch } = auth || {};

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await toast.promise(
        UserService.login({ email, password }),
        {
          loading: "Logging in...",
          success: "Welcome back 👋",
          error: (err) => err.response?.data?.message || "Login failed",
        },
      );

      dispatch({
        type: "LOGIN",
        payload: response.data,
      });

      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      console.log("Registering user:", { name, email, password });
      const response = await toast.promise(
        UserService.register({ name, email, password }),
        {
          loading: "Creating account ...",
          success: "Account Created Sucessfully 👋",
          error: (err) => err.response?.data?.message || "Account Creating failed",
        },
      );
      setIsLogin(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      {/* The container gets an extra class depending on state */}
      <div
        className={`login-modal-container ${!isLogin ? "flipped" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        {/* ================= LOGIN SIDE ================= */}
        <div className="modal-face login-face">
          <div className="login-header">
            <h1>ShopVerse</h1>
            <h2>Welcome Back 👋</h2>
            <p>Login to continue shopping with us.</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
                <input type="checkbox" /> Remember Me
              </label>
              <a href="/">Forgot Password?</a>
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button className="google-btn">
            <FaGoogle /> Continue with Google
          </button>

          <p className="register-text">
            Don't have an account?{" "}
            <span onClick={() => setIsLogin(false)}>Register</span>
          </p>
        </div>

        {/* ================= REGISTER SIDE ================= */}
        <div className="modal-face register-face">
          <div className="login-header">
            <h1>ShopVerse</h1>
            <h2>Create Account 🚀</h2>
            <p>Join us today and get the best deals.</p>
          </div>

          <form onSubmit={handleRegister}>
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={!name.trim() || !email.trim() || !password.trim()}
            >
              Sign Up
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button className="google-btn">
            <FaGoogle /> Sign up with Google
          </button>

          <p className="register-text">
            Already have an account?{" "}
            <span onClick={() => setIsLogin(true)}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
