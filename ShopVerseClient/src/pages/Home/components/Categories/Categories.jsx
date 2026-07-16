import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Categories.css";
import UserService from "../../../../services/UserService";
import AuthContext from "../../../../context/AuthContext";

import {
  FaLaptop,
  FaTshirt,
  FaMobileAlt,
  FaCouch,
  FaBook,
  FaFootballBall,
  FaShoppingBasket,
  FaGamepad,
  FaFolderOpen
} from "react-icons/fa";

// 1. THIS FUNCTION MUST BE DEFINED OUTSIDE THE COMPONENT (AND ABOVE IT)
const getIconForCategory = (name) => {
  switch (name?.toLowerCase()) {
    case "electronics": return <FaLaptop />;
    case "fashion": return <FaTshirt />;
    case "mobiles": return <FaMobileAlt />;
    case "furniture": return <FaCouch />;
    case "books": return <FaBook />;
    case "sports": return <FaFootballBall />;
    case "groceries": return <FaShoppingBasket />;
    case "gaming": return <FaGamepad />;
    default: return <FaFolderOpen />;
  }
};

const Categories = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Consume both auth state and the modal setter from context
  const { state, setShowLogin } = useContext(AuthContext) || {};
  const isLoggedIn = state?.isAuthenticated; 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await UserService.getAllCategories();
        const fetchedData = response.data.data || response.data; 

        if (Array.isArray(fetchedData)) {
          setCategoriesList(fetchedData);
        }
      } catch (error) {
        console.error("Failed to fetch categories via UserService:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categorySlug) => {
    if (isLoggedIn) {
      // User is logged in: proceed to the products page
      navigate(`/products/${categorySlug}`);
    } else {
      setShowLogin(true);
    }
  };

  if (loading) {
    return <div className="loading">Loading categories...</div>;
  }

  return (
    <section className="categories">
      <div className="container">
        <div className="section-title">
          <h2>Shop by Categories</h2>
          <p>Browse thousands of products across your favorite categories.</p>
        </div>

        <div className="category-grid">
          {categoriesList.map((category) => (
            <div 
              className="category-card" 
              key={category.id || category.categorySlug}
              onClick={() => handleCategoryClick(category.categorySlug)}
            >
              <div className="category-icon">
                {/* 2. Using the helper function here */}
                {getIconForCategory(category.categoryName)}
              </div>
              <h3>{category.categoryName}</h3>
              <p>{category.description || "Browse items"}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;