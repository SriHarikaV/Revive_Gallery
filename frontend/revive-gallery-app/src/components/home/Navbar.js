import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../static/images/revive-logo.png';
import { useUser } from '../auth/UserContext';
import '../../styles/home/Navbar.css'; 
import categories from '../../data/categories';

const Navbar = () => {
    const { user, token } = useUser();
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    }
  
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
                            <Link to={`/products?categories=${category.name}`}>{category.name}</Link>
                        </li>
                    ))}
                </ul>
            )}
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
  