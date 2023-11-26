import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../../static/images/revive-logo.png";
import { useUser } from "../auth/UserContext";
import "../../styles/home/Navbar.css";
import categories from "../../data/categories";

const Navbar = () => {
  const { user, token, logout } = useUser();
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    // Redirect to the home page after logout
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logoImage} alt="Revive Gallery Logo" />
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/products">Products</Link>
        </li>

        <li className="dropdown">
          <span onClick={toggleDropdown}>Categories</span>
          {isDropdownOpen && (
            <ul className="dropdown-content">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link to={`/products?categories=${category.name}`}>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>

        {user && token ? (
                    <>
                    <li>
                      <Link to="/addproduct">Add Product</Link>
                    </li>

                    <li>
                      <Link to="/messages">Messages</Link>
                    </li>
                  </>
        ) : null}

          
        {user && token ? (
          <>
            <li className="dropdown">
              <span onClick={toggleDropdown}>User Profile</span>
              {isDropdownOpen && (
                <ul className="dropdown-content">
                  <li>
                    <Link to="/user/trustworthiness">Trustworthiness: 0/10</Link>
                  </li>
                  <li>
                    <Link to={`/products?owner=${user._id}`}>My Products</Link>
                  </li>
                  <li>
                    <Link to={`products/wishlist?userId=${user._id}`}>Wishlist</Link>
                  </li>
                  <li>
                    <Link to="/user/cart">Cart</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              )}
            </li>

            {/* adding space between 'User Profile' and 'Hi ..' */}
            <li style={{ marginRight: "5px"}}></li> 

            <li>
              <p>Hi {user.firstName.toUpperCase()}</p>
            </li>
          </>
        ): 
        (<li>
          <Link to="/login">Sign in/</Link>
          <Link to="/register">Sign up</Link>
        </li>)
        }
      </ul>
    </nav>
  );
};

export default Navbar;
