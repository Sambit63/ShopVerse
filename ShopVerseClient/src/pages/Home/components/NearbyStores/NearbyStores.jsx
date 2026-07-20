import { useNavigate } from "react-router-dom";
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
    name: "ShopVerse Marathalli",
    address: "Marathalli, Bangalore",
    rating: "4.8",
    distance: "2.5 km",
    lat: 12.969324311438395,
    lon: 77.7061287017632,
  },
  {
    id: 2,
    name: "ShopVerse Whitefield",
    address: "Whitefield, Bangalore",
    rating: "4.7",
    distance: "18 km",
    lat: 12.994675536323266,
    lon: 77.70082042445455,
  },
  {
    id: 3,
    name: "ShopVerse MG Road",
    address: "MG Road, Bangalore",
    rating: "4.9",
    distance: "52 km",
    lat: 12.973154440345962,
    lon: 77.60707191922675,
  },
];

const NearbyStores = () => {
  const navigate = useNavigate();
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
                <button
                  className="direction-btn"
                  onClick={() =>
                    navigate(
                      `/map?lat=${store.lat}&lon=${store.lon}&name=${encodeURIComponent(store.name)}`,
                    )
                  }
                >
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
