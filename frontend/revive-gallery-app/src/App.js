import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import RegistrationForm from "./components/auth/RegistrationForm";
import ProductForm from "./components/products/ProductForm";
import ProductsList from "./components/products/ProductsList";
import ProductDetails from "./components/products/ProductDetails";
import Homepage from "./components/home/HomePage";

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/details" element={<ProductDetails />} />
          <Route path="/addproduct" element={<ProductForm />} />
      </Routes>   
    </Router>
    
  );
}

export default App;
