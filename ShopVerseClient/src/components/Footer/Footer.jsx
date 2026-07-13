import "./Footer.css";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="container">

        <div className="footer-grid">

          {/* Company */}

          <div className="footer-column">

            <h2 className="footer-logo">
              Shop<span>Verse</span>
            </h2>

            <p>
              ShopVerse is your smart shopping destination,
              bringing trusted brands, AI-powered recommendations,
              secure payments, and fast delivery together in one place.
            </p>

            <div className="social-icons">

              <a href="#">
                <FaFacebookF />
              </a>

              <a href="#">
                <FaInstagram />
              </a>

              <a href="#">
                <FaLinkedinIn />
              </a>

              <a href="#">
                <FaGithub />
              </a>

            </div>

          </div>

          {/* Quick Links */}

          <div className="footer-column">

            <h3>Quick Links</h3>

            <ul>

              <li>Home</li>

              <li>Products</li>

              <li>Categories</li>

              <li>Deals</li>

              <li>About Us</li>

            </ul>

          </div>

          {/* Categories */}

          <div className="footer-column">

            <h3>Categories</h3>

            <ul>

              <li>Electronics</li>

              <li>Fashion</li>

              <li>Groceries</li>

              <li>Books</li>

              <li>Furniture</li>

            </ul>

          </div>

          {/* Contact */}

          <div className="footer-column">

            <h3>Contact</h3>

            <ul>

              <li>

                <FaMapMarkerAlt />

                Bhubaneswar, Odisha

              </li>

              <li>

                <FaPhoneAlt />

                +91 9876543210

              </li>

              <li>

                <FaEnvelope />

                support@shopverse.com

              </li>

            </ul>

          </div>

        </div>

        <hr />

        <div className="footer-bottom">

          <p>
            © 2026 ShopVerse. All Rights Reserved.
          </p>

          <p>
            Made with ❤️ in India
          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;