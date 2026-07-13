import "./AIBanner.css";

import { FaRobot, FaArrowRight } from "react-icons/fa";

const AIBanner = () => {
  return (
    <section className="ai-banner">

      <div className="container ai-banner-container">

        {/* Left Side */}

        <div className="ai-content">

          <span className="ai-tag">
            AI Powered Shopping
          </span>

          <h2>
            Shop Smarter with
            <span> ShopVerse AI</span>
          </h2>

          <p>
            Discover products instantly with intelligent recommendations,
            compare prices, receive personalized suggestions, and find
            exactly what you need using our AI Shopping Assistant.
          </p>

          <button className="ai-btn">

            Try AI Assistant

            <FaArrowRight />

          </button>

        </div>

        {/* Right Side */}

        <div className="ai-icon-box">

          <div className="robot-circle">

            <FaRobot />

          </div>

        </div>

      </div>

    </section>
  );
};

export default AIBanner;