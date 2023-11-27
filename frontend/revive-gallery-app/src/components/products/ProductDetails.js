import React, { useEffect, useState } from 'react';
import ImageGallery from './ProductImageGallery';
import { useLocation } from 'react-router-dom';
import "../../styles/products/ProductDetails.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useUser } from "../auth/UserContext";
import ProductReviews from './ProductReviews';
import ProductReviewModal from './ProductReviewModal';

const ProductDetails = () => {
  const location = useLocation();
  const { user } = useUser();
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get('id');
  const [product, setProduct] = useState({});
  const [isWishlist, setIsWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    // Fetch product details and wishlist information
    const productUrl = `http://localhost:8080/api/product?_id=${productId}`;
    const wishlistUrl = `http://localhost:8080/api/wishlist?userId=${user._id}`;
    const cartUrl = `http://localhost:8080/api/cart?userId=${user._id}`;

    Promise.all([
      fetch(productUrl).then((response) => response.json()),
      fetch(wishlistUrl).then((response) => response.json()),
      fetch(cartUrl).then((response) => response.json()),
    ])
      .then(([productData, wishlistData, cartData]) => {
        setProduct(productData.products[0]);
        setReviews(productData.products[0].reviews);
        console.log('product', product);
        console.log('product reviews', product.reviews);
        // Check if the current product is wishlisted
        setIsWishlist(wishlistData.wishlist.some(item => item._id === productId));
        // Check if the current product is in cart
        setIsInCart(cartData.cart.some(item => item._id === productId));
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [productId]);

  if (Object.keys(product).length === 0) {
    // if product is empty, render nothing
    return null;
  }

  const handleReviewSubmit = (reviewText) => {
    // Call the API to submit the review
    fetch('http://localhost:8080/api/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user._id,
        productId: product._id,
        text: reviewText,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the reviews state with the new reviews
        setReviews([...reviews, data.reviews]);
      })
      .catch((error) => console.error('Error submitting review:', error));
  };
  
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

  const handleCart = () => {
    const cartUrl = "http://localhost:8080/api/cart";
    const method = isInCart ? "DELETE" : "POST";

    const body = {
      userId: user._id,
      productId: product._id,
      quantity: 1, // default
    };

    fetch(cartUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
        console.log("Cart updated successfully", data);
        setIsInCart(!isInCart);
      })
      .catch((error) => console.error("Error updating cart:", error));
  };

  return (
    <div className="product-details-container">
    <div className="product-details">
      <div className="product-info">
        <p className="product-status">{product.status}</p>
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
        <div>{`Owner: ${product.owner.firstName} ${product.owner.lastName}`}</div>
        <button>Chat with Owner</button>
        <button onClick={() => handleCart()}>{isInCart ? "Remove from Cart" : "Add to Cart"}</button>
        <button>Buy this online</button>
        <button onClick={() => setIsReviewModalOpen(true)}>Review This Product</button>
      </div>
      </div>

      {/* Display reviews */}
      <ProductReviews reviews={reviews} />

      {/* Review button */}
      {/* <button onClick={() => setIsReviewModalOpen(true)}>Review This Product</button> */}

      {/* Review modal */}
      <ProductReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </div>

  );
};

export default ProductDetails;