import "./BrandSection.css";

const brands = [
  "Apple",
  "Samsung",
  "Sony",
  "Nike",
  "Adidas",
  "Puma",
  "HP",
  "Dell",
];

const BrandSection = () => {
  return (
    <section className="brand-section">

      <div className="container">

        <div className="section-title">

          <h2>Trusted by Top Brands</h2>

          <p>
            Shop authentic products from the world's leading brands.
          </p>

        </div>

        <div className="brand-grid">

          {brands.map((brand, index) => (

            <div
              className="brand-card"
              key={index}
            >
              {brand}
            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default BrandSection;