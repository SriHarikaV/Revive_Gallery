import LoginForm from "./components/loginform";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationForm from "./components/registrationform";


function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
      </Routes>   
    </Router>
    
  );
}

export default App;
