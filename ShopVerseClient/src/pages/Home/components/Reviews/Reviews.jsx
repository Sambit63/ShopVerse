import "./Reviews.css";

import { FaStar, FaQuoteLeft } from "react-icons/fa";

const reviews = [
  {
    id: 1,
    name: "Rahul Sharma",
    city: "Bhubaneswar",
    rating: 5,
    review:
      "Amazing shopping experience! Fast delivery, genuine products and excellent customer support.",
  },
  {
    id: 2,
    name: "Priya Das",
    city: "Cuttack",
    rating: 5,
    review:
      "The AI Shopping Assistant helped me find the perfect laptop within my budget. Loved it!",
  },
  {
    id: 3,
    name: "Ankit Verma",
    city: "Puri",
    rating: 5,
    review:
      "Beautiful website, secure payment and quick checkout. Highly recommended!",
  },
];

const Reviews = () => {
  return (
    <section className="reviews">

      <div className="container">

        <div className="section-title">

          <h2>What Our Customers Say</h2>

          <p>
            Thousands of happy customers trust ShopVerse every day.
          </p>

        </div>

        <div className="review-grid">

          {reviews.map((review) => (

            <div className="review-card" key={review.id}>

              <FaQuoteLeft className="quote-icon" />

              <p className="review-text">
                {review.review}
              </p>

              <div className="stars">

                {[...Array(review.rating)].map((_, index) => (
                  <FaStar key={index} />
                ))}

              </div>

              <div className="review-user">

                <div className="avatar">
                  {review.name.charAt(0)}
                </div>

                <div>

                  <h4>{review.name}</h4>

                  <span>{review.city}</span>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default Reviews;