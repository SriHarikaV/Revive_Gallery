import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import ProductForm from "./components/ProductForm";
import Marketplace from "./components/marketplace";
import ProductDetails from "./components/productdetails";
import Homepage from "./components/homepage";



function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/mp" element={<Marketplace />} />
          <Route path="/products/1" element={<ProductDetails />} />
          <Route path="/add" element={<ProductForm />} />
      </Routes>   
    </Router>
    
  );
}

export default App;
