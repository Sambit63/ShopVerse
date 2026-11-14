import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLaptop,
  FaTshirt,
  FaCouch,
  FaBook,
  FaFootballBall,
  FaShoppingBasket,
  FaGamepad,
  FaMobileAlt,
  FaFolderOpen,
} from "react-icons/fa";

import "./CategoryChips.css";
import UserService from "../../../../services/UserService";
import AuthContext from "../../../../context/AuthContext";

const DEFAULT_CATEGORIES = [
  { id: "1", categoryName: "Electronics", categorySlug: "electronics", colorTheme: "blue" },
  { id: "2", categoryName: "Fashion", categorySlug: "fashion", colorTheme: "purple" },
  { id: "3", categoryName: "Furniture", categorySlug: "furniture", colorTheme: "amber" },
  { id: "4", categoryName: "Books", categorySlug: "books", colorTheme: "emerald" },
  { id: "5", categoryName: "Sports", categorySlug: "sports", colorTheme: "rose" },
  { id: "6", categoryName: "Groceries", categorySlug: "groceries", colorTheme: "green" },
  { id: "7", categoryName: "Gaming", categorySlug: "gaming", colorTheme: "indigo" },
];

const getCategoryIconAndTheme = (name) => {
  switch (name?.toLowerCase()) {
    case "electronics":
      return { icon: <FaLaptop />, theme: "theme-blue" };
    case "fashion":
      return { icon: <FaTshirt />, theme: "theme-purple" };
    case "furniture":
      return { icon: <FaCouch />, theme: "theme-amber" };
    case "books":
      return { icon: <FaBook />, theme: "theme-emerald" };
    case "sports":
      return { icon: <FaFootballBall />, theme: "theme-rose" };
    case "groceries":
      return { icon: <FaShoppingBasket />, theme: "theme-green" };
    case "gaming":
      return { icon: <FaGamepad />, theme: "theme-indigo" };
    case "mobiles":
      return { icon: <FaMobileAlt />, theme: "theme-cyan" };
    default:
      return { icon: <FaFolderOpen />, theme: "theme-blue" };
  }
};

const CategoryChips = () => {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const navigate = useNavigate();

  // Auth context for login verification
  const { state, setShowLogin } = useContext(AuthContext) || {};
  const isLoggedIn = state?.isAuthenticated;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await UserService.getAllCategories();
        const fetchedData = response.data?.data || response.data;
        if (Array.isArray(fetchedData) && fetchedData.length > 0) {
          setCategories(fetchedData);
        }
      } catch (error) {
        console.error("Failed to load category chips:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChipClick = (categorySlug) => {
    if (isLoggedIn) {
      // User is logged in: navigate to products page
      navigate(`/products/${categorySlug}`);
    } else {
      // Not logged in: trigger login modal
      setShowLogin(true);
    }
  };

  return (
    <section className="category-chips-section" aria-label="Quick Category Navigation">
      <div className="category-chips-container">
        <div className="chips-scroll-track">
          {categories.map((category) => {
            const { icon, theme } = getCategoryIconAndTheme(category.categoryName);
            return (
              <button
                key={category.id || category.categorySlug}
                type="button"
                className="category-chip-item"
                onClick={() => handleChipClick(category.categorySlug)}
                aria-label={`View ${category.categoryName}`}
              >
                <div className={`chip-bubble ${theme}`}>
                  {icon}
                </div>
                <span className="chip-label">{category.categoryName}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryChips;
