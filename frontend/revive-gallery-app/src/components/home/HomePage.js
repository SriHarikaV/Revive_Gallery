import React from 'react';
import "../../styles/home/HomePage.css";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();

  const handleExploreBtnClick = () => {
    navigate("/products");
  }

  const handleAddProductBtnClick = () => {
    navigate("/addproduct");
  }

  return (
    <div className="Homepage">
      <div className="LogoContainer">
        <img src="/images/revive-logo.png" alt="Your Logo" className="Logo" />
      </div>
      <div className="ContentContainer">
        <h1 className='MainHeading'>Welcome to the Revive Gallery</h1>
        <p className='SubHeading'>Embark on a treasure hunt for unique second-hand gems! </p>
        <p className='SubHeading'>Join our vibrant community and start your buying and selling adventure. Discover the best products with us and find great deals.</p>
        <div className='ButtonContainer'>
          <button className='ExploreButton' onClick={handleExploreBtnClick} >Start Exploring</button>
          <button className='AddProductButton' onClick={handleAddProductBtnClick} >Add Products</button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;

