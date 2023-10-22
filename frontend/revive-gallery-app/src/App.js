import LoginForm from "./components/loginform";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationForm from "./components/registrationform";
import Marketplace from "./components/marketplace";
import ProductDetails from "./components/productdetails";



function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/mp" element={<Marketplace />} />
          <Route path="/products/1" element={<ProductDetails />} />
      </Routes>   
    </Router>
    
  );
}

export default App;
