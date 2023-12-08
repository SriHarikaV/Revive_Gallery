import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import RegistrationForm from "./components/auth/RegistrationForm";
import ProductForm from "./components/products/ProductForm";
import EditProductForm from "./components/products/EditProductForm";
import ProductsList from "./components/products/ProductsList";
import ProductDetails from "./components/products/ProductDetails";
import Homepage from "./components/home/HomePage";
import { UserProvider } from "./components/auth/UserContext";
import PrivateRoute from "./components/auth/PrivateRoute";
import Navbar from "./components/home/Navbar"; // Import the Navbar component
import Messages from "./components/messages/Messages";
import AdminProfile from "./components/user/AdminProfile";
import UserProfile from "./components/user/UserProfile";
import Success from "./components/products/Success";

function App() {
  return (
    <UserProvider>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/products" element={<ProductsList />} />
            <Route path="/success" element={<Success />} />
            <Route exact path="/products/details" element={<PrivateRoute />}>
              <Route
                exact
                path="/products/details"
                element={<ProductDetails />}
              />
            </Route>
            <Route exact path="/products/wishlist" element={<PrivateRoute />}>
              <Route
                exact
                path="/products/wishlist"
                element={<ProductsList />}
              />
            </Route>
            <Route exact path="/products/cart" element={<PrivateRoute />}>
              <Route exact path="/products/cart" element={<ProductsList />} />
            </Route>
            <Route exact path="/addproduct" element={<PrivateRoute />}>
              <Route exact path="/addproduct" element={<ProductForm />} />
            </Route>
            <Route path="/editproduct/:id" element={<PrivateRoute />}>
              <Route
                path="/editproduct/:id"
                element={<EditProductPage />}
              />
            </Route>
            <Route path="/messages" element={<PrivateRoute />}>
              <Route index element={<Messages />} />
              <Route path=":chatId" element={<Messages />} />
            </Route>
            <Route path="/user/myprofile" element={<PrivateRoute />}>
              <Route exact path="/user/myprofile" element={<AdminProfile />}/>
            </Route>
            <Route path="/user/profile" element={<PrivateRoute />}>
              <Route index element={<AdminProfile />} />
              <Route path=":userId" element={<UserProfile />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

const EditProductPage = () => {
  const { id } = useParams();

  return (
    <EditProductForm productId={id} />
  );
};

export default App;
