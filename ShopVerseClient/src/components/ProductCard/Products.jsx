import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaArrowLeft,
  FaSlidersH,
  FaTimes,
} from "react-icons/fa";
import UserService from "../../services/UserService";
import "./Products.css";

// Individual Product Card Component to handle local swipe/carousel state
const ProductCard = ({ product }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["https://via.placeholder.com/180"];

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const swipeThreshold = 50; // Minimum swipe distance in pixels

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX; // Reset end x
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diffX = touchStartX.current - touchEndX.current;

    if (Math.abs(diffX) > swipeThreshold) {
      if (diffX > 0) {
        // Swiped Left -> Next Image
        nextImage();
      } else {
        // Swiped Right -> Prev Image
        prevImage();
      }
    }
  };

  const nextImage = () => {
    setCurrentImgIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImgIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
  };

  return (
    <div className="product-card">
      <div
        className="product-image-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Sliding Track containing all dynamic images */}
        <div
          className="image-slider-track"
          style={{ transform: `translateX(-${currentImgIndex * 100}%)` }}
        >
          {images.map((imgUrl, index) => (
            <div className="slide" key={index}>
              <img
                src={imgUrl}
                alt={`${product.productName || product.title} view ${index + 1}`}
                className="slide-image"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Carousel Indicators / Navigation Dots (only show if multiple images exist) */}
        {images.length > 1 && (
          <div className="carousel-dots">
            {images.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentImgIndex ? "active" : ""}`}
                onClick={() => setCurrentImgIndex(index)}
              />
            ))}
          </div>
        )}

        <button className="wishlist-btn" aria-label="Add to wishlist">
          <FaHeart />
        </button>
      </div>

      <div className="product-info">
        <span className="product-brand">{product.brand || "ShopVerse"}</span>
        <h3 className="product-name">{product.title || product.productName}</h3>

        <div className="product-rating">
          <FaStar className="star-filled" />
          <span>{product.rating || "4.5"}</span>
        </div>

        <div className="product-footer">
          <div className="product-price">
            <span className="current-price">₹{product.price}</span>
          </div>
          <button className="add-to-cart-btn" aria-label="Add to cart">
            <FaShoppingCart /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  const { categorySlug } = useParams();
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("featured");
  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const response = await UserService.getProductsByCategory(categorySlug);
        const fetchedData = response.data.data || response.data;

        if (Array.isArray(fetchedData)) {
          setProductsList(fetchedData);
        }
      } catch (error) {
        console.error(`Failed to fetch products for ${categorySlug}:`, error);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchCategoryProducts();
    }
  }, [categorySlug]);

  const sortedProducts = [...productsList].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  if (loading) {
    return (
      <div className="products-loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Native-style Sticky Top Header */}
      <header className="mobile-page-header">
        <Link to="/" className="back-circle-btn" aria-label="Go Back">
          <FaArrowLeft />
        </Link>
        <h1 className="header-category-title">
          {categorySlug?.replace("-", " ")}
        </h1>
        <div className="header-space"></div>
      </header>

      <div className="products-container">
        {/* Mobile Sticky Utility Bar */}
        <div className="mobile-utility-bar">
          <span className="results-count">
            <strong>{sortedProducts.length}</strong> items
          </span>
          <button
            className="mobile-filter-trigger"
            onClick={() => setIsSortOpen(true)}
          >
            <FaSlidersH /> Sort & Filter
          </button>
        </div>

        {/* Dynamic Grid Rendering */}
        {sortedProducts.length === 0 ? (
          <div className="empty-products">
            <h3>No products found.</h3>
            <p>We are stocking up on fresh items shortly!</p>
          </div>
        ) : (
          <div className="products-grid">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id || product.productId}
                product={product}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Native-style Bottom Drawer */}
      <div
        className={`bottom-sheet-overlay ${isSortOpen ? "active" : ""}`}
        onClick={() => setIsSortOpen(false)}
      >
        <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="sheet-header">
            <h3>Sort By</h3>
            <button
              className="sheet-close"
              onClick={() => setIsSortOpen(false)}
            >
              <FaTimes />
            </button>
          </div>
          <div className="sheet-options">
            {[
              { label: "Featured", value: "featured" },
              { label: "Price: Low to High", value: "price-low" },
              { label: "Price: High to Low", value: "price-high" },
              { label: "Top Rated", value: "rating" },
            ].map((option) => (
              <button
                key={option.value}
                className={`sheet-option-btn ${sortBy === option.value ? "selected" : ""}`}
                onClick={() => {
                  setSortBy(option.value);
                  setIsSortOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
