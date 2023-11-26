import React, { useEffect, useState } from 'react';
import ImageGallery from './ProductImageGallery';
import { useLocation } from 'react-router-dom';
import "../../styles/products/ProductDetails.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useUser } from "../auth/UserContext";

const ProductDetails = () => {
  const location = useLocation();
  const { user } = useUser();
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get('id');
  const [product, setProduct] = useState({});
  const [isWishlist, setIsWishlist] = useState(false);

  useEffect(() => {
    // Fetch product details and wishlist information
    const productUrl = `http://localhost:8080/api/product?_id=${productId}`;
    const wishlistUrl = `http://localhost:8080/api/wishlist?userId=${user._id}`;

    Promise.all([
      fetch(productUrl).then((response) => response.json()),
      fetch(wishlistUrl).then((response) => response.json()),
    ])
      .then(([productData, wishlistData]) => {
        setProduct(productData.products[0]);
        // Check if the current product is wishlisted
        setIsWishlist(wishlistData.products.some(item => item._id === productId));
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [productId]);

  if (Object.keys(product).length === 0) {
    // if product is empty, render nothing
    return null;
  }

  const handleWishlist = () => {
    setIsWishlist(!isWishlist);

    const wishlistUrl = "http://localhost:8080/api/wishlist";
    const method = isWishlist ? "DELETE" : "POST"; // Use DELETE if removing from wishlist
    fetch(wishlistUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user._id,
        productId: product._id,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log("Request failed. Status: " + response.status);
          throw new Error("Request failed");
        }
      })
      .then((data) => {
        console.log("Wishlist updated successfully", data);
      })
      .catch((error) => console.error("Error updating wishlist:", error));
  }; 

  return (
    <div className="product-details">
      <div className="product-info">
        <p className="product-status">Available</p>
        <div className="title-price">
          <h3 className="product-title">{product.title}</h3>
    <h3 className="product-price">${product.price}</h3>
        </div>
        <p className="product-description">{product.description}</p>
      </div>
      <div className="image-gallery">
        <button 
          onClick={() => handleWishlist()}
          style={{ backgroundColor: `rgba(0, 0, 0, 0)`, border: 'none' }}
        >
          <FontAwesomeIcon icon={faHeart} color={isWishlist ? 'magenta' : 'gray'} />
        </button>
        <ImageGallery images={product.images} />
      </div>
      <div className="owner-info">
        <div>To do owner name</div>
        <button>Chat with Owner</button>
        <button>Buy this online</button>
      </div>
    </div>
  );
};

export default ProductDetails;