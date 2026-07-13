import "./Categories.css";

import {
  FaLaptop,
  FaTshirt,
  FaMobileAlt,
  FaCouch,
  FaBook,
  FaFootballBall,
  FaShoppingBasket,
  FaGamepad,
} from "react-icons/fa";

const categories = [
  {
    id: 1,
    name: "Electronics",
    icon: <FaLaptop />,
    items: "250+ Products",
  },
  {
    id: 2,
    name: "Fashion",
    icon: <FaTshirt />,
    items: "320+ Products",
  },
  {
    id: 3,
    name: "Mobiles",
    icon: <FaMobileAlt />,
    items: "180+ Products",
  },
  {
    id: 4,
    name: "Furniture",
    icon: <FaCouch />,
    items: "150+ Products",
  },
  {
    id: 5,
    name: "Books",
    icon: <FaBook />,
    items: "420+ Products",
  },
  {
    id: 6,
    name: "Sports",
    icon: <FaFootballBall />,
    items: "170+ Products",
  },
  {
    id: 7,
    name: "Groceries",
    icon: <FaShoppingBasket />,
    items: "600+ Products",
  },
  {
    id: 8,
    name: "Gaming",
    icon: <FaGamepad />,
    items: "110+ Products",
  },
];

const Categories = () => {
  return (
    <section className="categories">

      <div className="container">

        <div className="section-title">

          <h2>Shop by Categories</h2>

          <p>
            Browse thousands of products across your favorite categories.
          </p>

        </div>

        <div className="category-grid">

          {categories.map((category) => (

            <div className="category-card" key={category.id}>

              <div className="category-icon">
                {category.icon}
              </div>

              <h3>{category.name}</h3>

              <p>{category.items}</p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default Categories;