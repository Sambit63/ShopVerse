import "./Newsletter.css";

import { FaPaperPlane } from "react-icons/fa";

const Newsletter = () => {
  return (
    <section className="newsletter">

      <div className="container">

        <div className="newsletter-card">

          <h2>Never Miss a Deal!</h2>

          <p>
            Subscribe to receive exclusive offers, early access to sales,
            AI-powered shopping recommendations and exciting discounts.
          </p>

          <div className="newsletter-form">

            <input
              type="email"
              placeholder="Enter your email address"
            />

            <button>

              <FaPaperPlane />

              Subscribe

            </button>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Newsletter;