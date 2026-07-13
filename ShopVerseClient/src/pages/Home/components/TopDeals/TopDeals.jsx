import "./TopDeals.css";

import {
  FaBolt,
  FaArrowRight,
  FaClock,
} from "react-icons/fa";

const TopDeals = () => {
  return (
    <section className="top-deals">

      <div className="container">

        <div className="deal-card">

          {/* Left */}

          <div className="deal-content">

            <span className="deal-tag">
              <FaBolt />
              Limited Time Offer
            </span>

            <h2>
              Mega Shopping Sale
              <br />
              Up To <span>70% OFF</span>
            </h2>

            <p>
              Grab amazing discounts on Electronics, Fashion,
              Home Appliances, Mobiles and many more before
              the sale ends.
            </p>

            <div className="countdown">

              <div className="time-box">
                <h3>02</h3>
                <span>Days</span>
              </div>

              <div className="time-box">
                <h3>15</h3>
                <span>Hours</span>
              </div>

              <div className="time-box">
                <h3>48</h3>
                <span>Minutes</span>
              </div>

            </div>

            <button className="deal-btn">

              Shop Deals

              <FaArrowRight />

            </button>

          </div>

          {/* Right */}

          <div className="deal-image">

            <div className="offer-circle">

              <h1>70%</h1>

              <p>OFF</p>

            </div>

            <FaClock className="clock-icon" />

          </div>

        </div>

      </div>

    </section>
  );
};

export default TopDeals;