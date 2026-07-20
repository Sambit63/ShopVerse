import Navbar from "../../components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Categories from "./components/Categories/Categories";
import FeaturedProducts from "./components/FeaturedProducts/FeaturedProducts";
import AIBanner from "./components/AIBanner/AIBanner";
import TopDeals from "./components/TopDeals/TopDeals";
import TrendingProducts from "./components/TrendingProducts/TrendingProducts";
import BrandSection from "./components/BrandSection/BrandSection";
import NearbyStores from "./components/NearbyStores/NearbyStores";
import Reviews from "./components/Reviews/Reviews";
import Newsletter from "./components/Newsletter/Newsletter";
import Footer from "../../components/Footer/Footer";
import { useRef } from "react";

const Home = () => {
  const categoriesRef = useRef(null);

  return (
    <>
      <Navbar />

      <Hero categoriesRef={categoriesRef} />

      <div ref={categoriesRef}>
        <Categories />
      </div>

      <FeaturedProducts />

      <AIBanner />

      <TopDeals />

      <TrendingProducts />

      <BrandSection />

      <NearbyStores />

      <Reviews />

      <Newsletter />

      <Footer />
    </>
  );
};

export default Home;