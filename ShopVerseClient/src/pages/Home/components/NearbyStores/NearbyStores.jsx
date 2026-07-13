import "./NearbyStores.css";

import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaStar,
  FaDirections,
} from "react-icons/fa";

const stores = [
  {
    id: 1,
    name: "ShopVerse Bhubaneswar",
    address: "Patia, Bhubaneswar",
    rating: "4.8",
    distance: "2.5 km",
  },
  {
    id: 2,
    name: "ShopVerse Cuttack",
    address: "Badambadi, Cuttack",
    rating: "4.7",
    distance: "18 km",
  },
  {
    id: 3,
    name: "ShopVerse Puri",
    address: "Grand Road, Puri",
    rating: "4.9",
    distance: "52 km",
  },
];

const NearbyStores = () => {
  return (
    <section className="nearby-stores">

      <div className="container">

        <div className="section-title">

          <h2>Find Stores Near You</h2>

          <p>
            Visit your nearest ShopVerse partner store for instant shopping.
          </p>

        </div>

        <div className="store-grid">

          {stores.map((store) => (

            <div className="store-card" key={store.id}>

              <div className="store-top">

                <FaMapMarkerAlt className="location-icon" />

                <span>{store.distance}</span>

              </div>

              <h3>{store.name}</h3>

              <p>{store.address}</p>

              <div className="store-rating">

                <FaStar />

                {store.rating}

              </div>

              <div className="store-buttons">

                <button className="direction-btn">

                  <FaDirections />

                  Directions

                </button>

                <button className="call-btn">

                  <FaPhoneAlt />

                  Call

                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default NearbyStores;