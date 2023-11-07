import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../static/images/revive-logo.png';
import { useUser } from '../auth/UserContext';
import '../../styles/home/Navbar.css'; 

const Navbar = () => {
    const { user, token } = useUser();
  
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
          <li>
            <Link to="/products">Categories</Link>
          </li>
          {user && token ? (
            <li>
              <Link to="/addproduct">Add Product</Link>
            </li>
          ) : null}
          
        </ul>
      </nav>
    );
  };
  
  export default Navbar;
  