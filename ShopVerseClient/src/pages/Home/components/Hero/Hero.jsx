import "./Hero.css";
import heroImage from "../../../../assets/hero.png";
import { FaArrowRight, FaStar, FaTruck, FaShieldAlt } from "react-icons/fa";

const Hero = ({ categoriesRef }) => {
  const scrollToCategories = () => {
    categoriesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  return (
    <section className="hero">
      <div className="container hero-container">
        {/* Left Content */}

        <div className="hero-content">
          <span className="hero-tag">
            🚀 India's Smart Shopping Destination
          </span>

          <h1>
            Discover Everything
            <br />
            You Need at
            <span> ShopVerse</span>
          </h1>

          <p>
            Explore thousands of products from trusted brands with exclusive
            deals, AI-powered recommendations and lightning-fast delivery.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">
              Shop Now
              <FaArrowRight />
            </button>

            <button className="secondary-btn" onClick={scrollToCategories}>
              Explore Categories
            </button>
          </div>

          <div className="hero-features">
            <div>
              <FaStar />
              <span>4.9 Rating</span>
            </div>

            <div>
              <FaTruck />
              <span>Free Delivery</span>
            </div>

            <div>
              <FaShieldAlt />
              <span>Secure Payment</span>
            </div>
          </div>
        </div>

        {/* Right Image */}

        <div className="hero-image">
          <img src={heroImage} alt="ShopVerse Hero" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
