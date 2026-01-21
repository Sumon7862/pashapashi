import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import products from "./data/products";
import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home products={products} />} />
        <Route path="/product/:id" element={<ProductDetails products={products} />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}
