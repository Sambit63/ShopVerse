import "./FeaturedProducts.css";

import {
  FaStar,
  FaShoppingCart,
  FaHeart,
} from "react-icons/fa";

const products = [
  {
    id: 1,
    name: "Apple iPhone 16 Pro",
    image: "https://picsum.photos/300?random=1",
    price: "₹1,19,999",
    oldPrice: "₹1,29,999",
    rating: 4.8,
    discount: "8% OFF",
  },
  {
    id: 2,
    name: "Sony WH-1000XM5",
    image: "https://picsum.photos/300?random=2",
    price: "₹29,999",
    oldPrice: "₹34,999",
    rating: 4.9,
    discount: "14% OFF",
  },
  {
    id: 3,
    name: "Nike Air Max",
    image: "https://picsum.photos/300?random=3",
    price: "₹8,999",
    oldPrice: "₹10,999",
    rating: 4.7,
    discount: "18% OFF",
  },
  {
    id: 4,
    name: "Samsung Smart TV",
    image: "https://picsum.photos/300?random=4",
    price: "₹54,999",
    oldPrice: "₹61,999",
    rating: 4.8,
    discount: "12% OFF",
  },
];

const FeaturedProducts = () => {
  return (
    <section className="featured-products">

      <div className="container">

        <div className="section-title">

          <h2>Featured Products</h2>

          <p>
            Handpicked products recommended just for you.
          </p>

        </div>

        <div className="product-grid">

          {products.map((product) => (

            <div className="product-card" key={product.id}>

              <span className="discount-badge">
                {product.discount}
              </span>

              <button className="wishlist-btn">
                <FaHeart />
              </button>

              <img
                src={product.image}
                alt={product.name}
              />

              <h3>{product.name}</h3>

              <div className="rating">

                <FaStar />

                <span>{product.rating}</span>

              </div>

              <div className="price">

                <span className="new-price">
                  {product.price}
                </span>

                <span className="old-price">
                  {product.oldPrice}
                </span>

              </div>

              <button className="cart-btn">

                <FaShoppingCart />

                Add to Cart

              </button>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default FeaturedProducts;