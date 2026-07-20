import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
// 1. Import your newly created Products page component
import Products from "../components/ProductCard/Products"; // Make sure this path matches your file structure!
import Map from "../pages/Home/components/Map/Map";

// import Cart from "../pages/Cart/Cart";
// import Wishlist from "../pages/Wishlist/Wishlist";
// import Category from "../pages/Category/Category";
// import ProductDetails from "../pages/ProductDetails/ProductDetails";
// import AIAssistant from "../pages/AIAssistant/AIAssistant";
// import Profile from "../pages/Profile/Profile";
// import Orders from "../pages/Orders/Orders";
// import NotFound from "../pages/NotFound/NotFound";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      {/* 2. Added Route for Category-wise Products Page */}
      {/* ":categorySlug" will dynamically capture "electronics", "fashion", etc. */}
      <Route path="/products/:categorySlug" element={<Products />} />
      <Route path="/map" element={<Map />} />

      {/* <Route path="/cart" element={<Cart />} /> */}

      {/* <Route path="/wishlist" element={<Wishlist />} /> */}

      {/* <Route path="/category/:categoryName" element={<Category />} /> */}

      {/* <Route path="/product/:productId" element={<ProductDetails />} /> */}

      {/* <Route path="/ai" element={<AIAssistant />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="/orders" element={<Orders />} /> */}

      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AllRoutes;