import React, {useEffect, useState} from 'react';
import ImageGallery from './ProductImageGallery';
import { useLocation } from 'react-router-dom';
import "../../styles/products/ProductDetails.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const ProductDetails = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get('id');
  const [product, setProduct] = useState({});
  const [isWishlist, setIsWishlist] = useState(false);


  useEffect(() => {
let productUrl = `http://localhost:8080/api/product?_id=${productId}`;

    // Fetch the product with given productId from the backend API
    fetch(productUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
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
        setProduct(data.products[0]);
    })
    .catch((error) => console.error("Error fetching products:", error));
  }, [productId]);

  if (Object.keys(product).length === 0) {
    // if product is empty, render nothing
    return null;
  }

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
          onClick={() => setIsWishlist(!isWishlist)}
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