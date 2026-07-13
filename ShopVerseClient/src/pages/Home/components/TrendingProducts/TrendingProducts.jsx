import "./TrendingProducts.css";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { FaStar, FaShoppingCart } from "react-icons/fa";

const trendingProducts = [
  {
    id: 1,
    name: "MacBook Air M4",
    image: "https://picsum.photos/300?random=11",
    price: "₹1,14,999",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Apple Watch Ultra",
    image: "https://picsum.photos/300?random=12",
    price: "₹79,999",
    rating: 4.8,
  },
  {
    id: 3,
    name: "PlayStation 5",
    image: "https://picsum.photos/300?random=13",
    price: "₹54,999",
    rating: 4.9,
  },
  {
    id: 4,
    name: "Canon EOS R10",
    image: "https://picsum.photos/300?random=14",
    price: "₹89,999",
    rating: 4.7,
  },
  {
    id: 5,
    name: "Samsung Galaxy S25",
    image: "https://picsum.photos/300?random=15",
    price: "₹84,999",
    rating: 4.8,
  },
];

const TrendingProducts = () => {
  return (
    <section className="trending-products">

      <div className="container">

        <div className="section-title">

          <h2>Trending Products</h2>

          <p>
            Most loved products by our customers this week.
          </p>

        </div>

        <Swiper
          spaceBetween={25}
          slidesPerView={4}
          breakpoints={{
            320: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
        >

          {trendingProducts.map((product) => (

            <SwiperSlide key={product.id}>

              <div className="trend-card">

                <img
                  src={product.image}
                  alt={product.name}
                />

                <h3>{product.name}</h3>

                <div className="trend-rating">

                  <FaStar />

                  {product.rating}

                </div>

                <h4>{product.price}</h4>

                <button>

                  <FaShoppingCart />

                  Add to Cart

                </button>

              </div>

            </SwiperSlide>

          ))}

        </Swiper>

      </div>

    </section>
  );
};

export default TrendingProducts;