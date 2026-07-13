import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
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