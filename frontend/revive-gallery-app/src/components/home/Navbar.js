import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../../static/images/revive-logo.png";
import { useUser } from "../auth/UserContext";
import "../../styles/home/Navbar.css";
import categories from "../../data/categories";
import PremiumImg from "../../static/images/premium.png";
import {
  calculateAverageProductsRating,
  calculateAverageReviewRating,
  calculateTrustworthinessScore,
} from "../../utils/calculateScore";

const Navbar = () => {
  const { user, token, logout, setUser } = useUser();
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const [error, setError] = useState(null);
  useState(0);

  useEffect(() => {
    if (user) {
      // Fetch user profile data using the API
      const userProfileUrl = `http://localhost:8080/api/user/get?_id=${user._id}`;

      fetchUserProfile(userProfileUrl);
    }
  }, []);

  const fetchUserProfile = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Request failed with status: " + response.status);
      }
      const data = await response.json();

      // Fetch products and calculate trustworthiness score
      const productsUrl = `http://localhost:8080/api/product?owner=${user._id}`;
      const response2 = await fetch(productsUrl);
      if (!response2.ok) {
        throw new Error("Request failed with status: " + response2.status);
      }
      const productsData = await response2.json();

      // Calculate trustworthiness score using the utility function
      const averageProductsRatings = calculateAverageProductsRating(
        productsData.products
      );

      const averageProductReviewRatings = await calculateAverageReviewRating(
        productsData.products
      );

      const averageUserProfileRatings = calculateAverageUserProfileRating(
        data.user.ratings
      );

      const result = calculateTrustworthinessScore(
        averageUserProfileRatings,
        averageProductsRatings,
        averageProductReviewRatings
      );
      
      if (result > 3) {
        const updatedUser = {
          ...user,
          isPremium: true,
        };
        setUser(updatedUser, 1234);
      } else {
        const updatedUser = {
          ...user,
          isPremium: false,
        };
        setUser(updatedUser, 1234);
      }
      console.log(result);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError(error.message);
    }
  };

  // function to calculate the average rating
  const calculateAverageUserProfileRating = (ratings) => {
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return sum / ratings.length;
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    // Redirect to the home page after logout
    navigate("/");
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
                    <Link to={`/user/myprofile`}>My Profile</Link>
                  </li>
                  <li>
                    <Link to={`/products?owner=${user._id}`}>My Products</Link>
                  </li>
                  <li>
                    <Link to={`products/wishlist?userId=${user._id}`}>
                      Wishlist
                    </Link>
                  </li>
                  <li>
                    <Link to={`products/cart?userId=${user._id}`}>Cart</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              )}
            </li>

            {/* adding space between 'User Profile' and 'Hi ..' */}
            <li style={{ marginRight: "5px" }}></li>

            <li
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <span>Hi {user.firstName.toUpperCase()} </span>
              {user?.isPremium && (
                <img
                  src={PremiumImg}
                  alt="Premium"
                  style={{
                    height: 30,
                    marginLeft: 4,
                  }}
                />
              )}
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">Sign in/</Link>
            <Link to="/register">Sign up</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
