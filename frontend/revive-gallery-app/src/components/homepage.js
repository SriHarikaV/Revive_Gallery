import React from 'react';
import './homepage.css';

const Homepage = () => {
  return (
    <div className="Homepage">
      <div className="LogoContainer">
        <img src="/images/revive-logo.png" alt="Your Logo" className="Logo" />
      </div>
      <div className="ContentContainer">
        <h1>Welcome to Our Online Store</h1>
        <p>Discover the best products with us.</p>
        <p>Shop now and find great deals.</p>
      </div>
    </div>
  );
};

export default Homepage;
