import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/loginform";
import RegistrationForm from "./components/registrationform";
import ProductForm from "./components/productform";
import Marketplace from "./components/marketplace";



function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/mp" element={<Marketplace />} />
          <Route path="/add" element={<ProductForm />} />
      </Routes>   
    </Router>
    
  );
}

export default App;
