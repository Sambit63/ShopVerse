import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaRobot,
  FaChevronDown,
  FaMicrophone,
  FaSun,
  FaMoon,
  FaLaptop,
  FaTshirt,
  FaCouch,
  FaBook,
  FaFootballBall,
  FaShoppingBasket,
  FaGamepad,
  FaFolderOpen,
} from "react-icons/fa";

import "./Navbar.css";
import Login from "../../pages/Login/Login";
import AuthContext from "../../context/AuthContext";
import UserService from "../../services/UserService";
import { useTheme } from "../../context/ThemeContext";

const DEFAULT_CATEGORIES = [
  { id: "1", categoryName: "Electronics", categorySlug: "electronics" },
  { id: "2", categoryName: "Fashion", categorySlug: "fashion" },
  { id: "3", categoryName: "Furniture", categorySlug: "furniture" },
  { id: "4", categoryName: "Books", categorySlug: "books" },
  { id: "5", categoryName: "Sports", categorySlug: "sports" },
  { id: "6", categoryName: "Groceries", categorySlug: "groceries" },
  { id: "7", categoryName: "Gaming", categorySlug: "gaming" },
];

const getCategoryIcon = (name) => {
  switch (name?.toLowerCase()) {
    case "electronics":
      return <FaLaptop className="cat-icon" />;
    case "fashion":
      return <FaTshirt className="cat-icon" />;
    case "furniture":
      return <FaCouch className="cat-icon" />;
    case "books":
      return <FaBook className="cat-icon" />;
    case "sports":
      return <FaFootballBall className="cat-icon" />;
    case "groceries":
      return <FaShoppingBasket className="cat-icon" />;
    case "gaming":
      return <FaGamepad className="cat-icon" />;
    default:
      return <FaFolderOpen className="cat-icon" />;
  }
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const dropdownRef = useRef(null);

  // Consume both auth state and the modal setter from context
  const { state, showLogin, setShowLogin } = useContext(AuthContext) || {};
  const { theme, toggleTheme, isDark } = useTheme();
  const isLoggedIn = state?.isAuthenticated;
  const navigate = useNavigate();

  const handleCategoryClick = (categorySlug) => {
    setCategoryOpen(false);
    setMenuOpen(false);
    if (isLoggedIn) {
      navigate(`/products/${categorySlug}`);
    } else {
      setShowLogin(true);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await UserService.getAllCategories();
        const fetchedData = response.data?.data || response.data;
        if (Array.isArray(fetchedData) && fetchedData.length > 0) {
          setCategories(fetchedData);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="logo">
            <span className="logo-main">Shop</span>
            <span className="logo-accent">Verse</span>
          </Link>

          {/* Desktop Search (Hidden on Mobile) */}
          <div className="search-container desktop-search">
            <input
              type="text"
              placeholder="Search products, brands and more..."
              className="search-input"
            />
            <button className="search-btn" aria-label="Search">
              <FaSearch />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="nav-links">
            <div
              className="category-dropdown"
              ref={dropdownRef}
              onMouseEnter={() => setCategoryOpen(true)}
              onMouseLeave={() => setCategoryOpen(false)}
            >
              <button
                className="category-btn"
                type="button"
                onClick={() => setCategoryOpen((prev) => !prev)}
                aria-expanded={categoryOpen}
              >
                Categories
                <FaChevronDown
                  className={`down-icon ${categoryOpen ? "rotate" : ""}`}
                />
              </button>

              {categoryOpen && (
                <div className="nav-dropdown-menu">
                  {categories.map((category) => (
                    <button
                      key={category.id || category.categorySlug}
                      type="button"
                      className="nav-dropdown-item"
                      onClick={() => handleCategoryClick(category.categorySlug)}
                    >
                      {getCategoryIcon(category.categoryName)}
                      <span>{category.categoryName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link to="/ai" className="icon-link ai-link">
              <FaRobot />
              <span>AI</span>
            </Link>

            <Link to="/wishlist" className="icon-link">
              <FaHeart />
              <span>Wishlist</span>
            </Link>

            <Link to="/cart" className="icon-link cart-link">
              <FaShoppingCart />
              <span className="cart-badge">2</span>
            </Link>

            {/* Dark / Light Theme Toggle (Desktop) */}
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              title={`Switch to ${isDark ? "light" : "dark"} mode`}
            >
              <div className={`theme-toggle-track ${isDark ? "dark" : "light"}`}>
                <span className="theme-toggle-thumb">
                  {isDark ? <FaSun className="icon-sun" /> : <FaMoon className="icon-moon" />}
                </span>
              </div>
            </button>

            {/* Login - Toggles global state now */}
            <button
              className="icon-link login-button"
              onClick={() => setShowLogin(true)}
            >
              <FaUser />
              <span>Login</span>
            </button>
          </nav>

          {/* Mobile Quick Action Buttons (Visible on Mobile) */}
          <div className="mobile-actions">
            {/* Dark / Light Theme Toggle (Mobile) */}
            <button
              type="button"
              className="mobile-icon-link theme-toggle-mobile"
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            >
              {isDark ? <FaSun className="icon-sun-mobile" /> : <FaMoon className="icon-moon-mobile" />}
            </button>

            <Link to="/wishlist" className="mobile-icon-link" aria-label="Wishlist">
              <FaHeart />
            </Link>
            <Link to="/cart" className="mobile-icon-link cart-link" aria-label="Cart">
              <FaShoppingCart />
              <span className="cart-badge">2</span>
            </Link>
            <button
              className="menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile-First Prominent Search Bar (Always visible on mobile) */}
        <div className="mobile-top-search">
          <div className="mobile-search-bar">
            <FaSearch className="mobile-search-icon" />
            <input
              type="text"
              placeholder="Search Electronics, Fashion, Brands..."
              className="mobile-search-input"
            />
            <button
              type="button"
              className="mobile-mic-btn"
              aria-label="Voice search"
            >
              <FaMicrophone />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${menuOpen ? "active" : ""}`}>
          <div className="mobile-search">
            <input type="text" placeholder="Search..." />
            <button>
              <FaSearch />
            </button>
          </div>

          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          {/* Mobile Categories Dropdown */}
          <div className="mobile-category-wrapper">
            <button
              className="mobile-category-toggle"
              type="button"
              onClick={() => setCategoryOpen((prev) => !prev)}
            >
              <span>Categories</span>
              <FaChevronDown
                className={`down-icon ${categoryOpen ? "rotate" : ""}`}
              />
            </button>
            {categoryOpen && (
              <div className="mobile-category-list">
                {categories.map((category) => (
                  <button
                    key={category.id || category.categorySlug}
                    type="button"
                    className="mobile-category-item"
                    onClick={() => handleCategoryClick(category.categorySlug)}
                  >
                    {category.categoryName}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link to="/ai" onClick={() => setMenuOpen(false)}>
            AI Shopping Assistant
          </Link>
          <Link to="/wishlist" onClick={() => setMenuOpen(false)}>
            Wishlist
          </Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>
            Cart
          </Link>

          {/* Mobile Menu Theme Switcher Row */}
          <div className="mobile-theme-row" onClick={toggleTheme}>
            <span className="mobile-theme-label">
              {isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </span>
            <div className={`theme-toggle-track ${isDark ? "dark" : "light"}`}>
              <span className="theme-toggle-thumb">
                {isDark ? <FaSun className="icon-sun" /> : <FaMoon className="icon-moon" />}
              </span>
            </div>
          </div>

          <button
            className="mobile-login-btn"
            onClick={() => {
              setMenuOpen(false);
              setShowLogin(true); // Toggles global state
            }}
          >
            Login
          </button>
        </div>
      </header>

      {/* Login Modal */}
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default Navbar;
