import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaRobot,
  FaChevronDown,
} from "react-icons/fa";

import "./Navbar.css";
import Login from "../../pages/Login/Login";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <header className="navbar">
        <div className="navbar-container">

          {/* Logo */}
          <Link to="/" className="logo">
            <span className="logo-main">Shop</span>
            <span className="logo-accent">Verse</span>
          </Link>

          {/* Desktop Search */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
            />

            <button className="search-btn">
              <FaSearch />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="nav-links">

            {/* Categories */}
            <div
              className="category-dropdown"
              onMouseEnter={() => setCategoryOpen(true)}
              onMouseLeave={() => setCategoryOpen(false)}
            >
              <button className="category-btn">
                Categories
                <FaChevronDown className="down-icon" />
              </button>

              {categoryOpen && (
                <div className="dropdown-menu">
                  <Link to="/category/electronics">
                    Electronics
                  </Link>

                  <Link to="/category/fashion">
                    Fashion
                  </Link>

                  <Link to="/category/home">
                    Home
                  </Link>

                  <Link to="/category/grocery">
                    Grocery
                  </Link>

                  <Link to="/category/books">
                    Books
                  </Link>

                  <Link to="/category/toys">
                    Toys
                  </Link>
                </div>
              )}
            </div>

            {/* AI */}
            <Link to="/ai" className="icon-link ai-link">
              <FaRobot />
              <span>AI</span>
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" className="icon-link">
              <FaHeart />
              <span>Wishlist</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="icon-link cart-link">
              <FaShoppingCart />
              <span className="cart-badge">2</span>
            </Link>

            {/* Login */}
            <button
              className="icon-link login-button"
              onClick={() => setShowLogin(true)}
            >
              <FaUser />
              <span>Login</span>
            </button>

          </nav>

          {/* Mobile Menu Button */}
          <button
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${menuOpen ? "active" : ""}`}>

          <div className="mobile-search">

            <input
              type="text"
              placeholder="Search..."
            />

            <button>
              <FaSearch />
            </button>

          </div>

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/category"
            onClick={() => setMenuOpen(false)}
          >
            Categories
          </Link>

          <Link
            to="/ai"
            onClick={() => setMenuOpen(false)}
          >
            AI Shopping Assistant
          </Link>

          <Link
            to="/wishlist"
            onClick={() => setMenuOpen(false)}
          >
            Wishlist
          </Link>

          <Link
            to="/cart"
            onClick={() => setMenuOpen(false)}
          >
            Cart
          </Link>

          {/* Mobile Login */}
          <button
            className="mobile-login-btn"
            onClick={() => {
              setMenuOpen(false);
              setShowLogin(true);
            }}
          >
            Login
          </button>

        </div>
      </header>

      {/* Login Modal */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
        />
      )}
    </>
  );
};

export default Navbar;