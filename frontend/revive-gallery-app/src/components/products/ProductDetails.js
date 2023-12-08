import React, { useEffect, useState } from "react";
import ImageGallery from "./ProductImageGallery";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/products/ProductDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../auth/UserContext";
import ProductReviews from "./ProductReviews";
import ProductReviewModal from "./ProductReviewModal";
import ProductRatingModal from "./ProductRatingModal";
import UserRatingModal from "./UserRatingModal";
import StripeCheckout from "react-stripe-checkout";
import { createChatRoom, updateProductStatus } from "../messages/services";
import { Button, Form, Modal } from "react-bootstrap";

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useUser();
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get("id");
  const [product, setProduct] = useState({});
  const [isWishlist, setIsWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [toggleReviewAdded, setToggleReviewAdded] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isProfileRatingModalOpen, setIsProfileRatingModalOpen] =
    useState(false);
  const [rating, setRating] = useState(0);
  const [profileRating, setProfileRating] = useState(0);
  const [showMsg, setShowMsg] = useState(false);
  const [message, setMessage] = useState("");

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
        console.log("product", product);
        console.log("product reviews", product.reviews);
        // Check if the current product is wishlisted
        setIsWishlist(
          wishlistData.wishlist.some((item) => item._id === productId)
        );
        // Check if the current product is in cart
        setIsInCart(cartData.cart.some((item) => item._id === productId));
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [productId, toggleReviewAdded]);

  if (Object.keys(product).length === 0) {
    // if product is empty, render nothing
    return null;
  }

  const handleReviewSubmit = (reviewText) => {
    // Call the API to submit the review
    fetch("http://localhost:8080/api/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user._id,
        productId: product._id,
        text: reviewText,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setToggleReviewAdded(!toggleReviewAdded);
      })
      .catch((error) =>
        console.error("Error submitting product rating:", error)
      );
  };

  // Handle rating submission
  const handleRatingSubmit = (selectedRating) => {
    // Call the API to submit the review
    fetch("http://localhost:8080/api/rating", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user._id,
        productId: product._id,
        rating: selectedRating,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setToggleReviewAdded(!toggleReviewAdded);
      })
      .catch((error) => console.error("Error submitting review:", error));
  };

  // Handle rating submission
  const handleProfileRatingSubmit = (selectedRating) => {
    // Call the API to submit the review
    fetch("http://localhost:8080/api/user-rating", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ratedUserId: user._id,
        userId: product.owner._id,
        rating: selectedRating,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setToggleReviewAdded(!toggleReviewAdded);
      })
      .catch((error) => console.error("Error submitting review:", error));
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

  // Calculate the average rating
  const averageRating =
    product.ratings.reduce((total, rating) => total + rating.rating, 0) /
    (product.ratings.length || 1); // Avoid division by zero

  const priceForStripe = product.price;
  const publishableKey =
    "pk_test_51Ht8t0AUGh2stU4g2NhzjhmzwmSJ6Mt3ghnJAbE6L6xGm0BpbgVQaids6bI9ZboSENHhYe87U2VVsai87mR3QdeJ00VoxGi0Ho";
  const onToken = async () => {
    await updateProductStatus(productId, "Sold Out");
    navigate("/success");
  };
  const handleChat = (product) => {
    setShowMsg(true);
    setProduct(product);
  };

  const onMsgSent = (e) => {
    e.preventDefault();
    createChatRoom(product.owner._id, message)
      .then((res) => {
        navigate(`/messages/${res.messageId}`);
      })
      .catch((err) => console.log(err));
  };

  const handleMsgChange = (e) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  const handleClose = () => setShowMsg(false);

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
          {product.status !== "Sold Out" && (
            <StripeCheckout
              label="Buy this online"
              name="Product purchase"
              billingAddress
              shippingAddress
              description={`Your total is $${priceForStripe}.00`}
              amount={priceForStripe * 100}
              panelLabel="Pay Now"
              token={onToken}
              stripeKey={publishableKey}
            ></StripeCheckout>
          )}

          <button className="add-to-cart" onClick={() => handleCart()}>
            {isInCart ? "Remove from Cart" : "Add to Cart"}
          </button>
        </div>

        <div className="image-gallery">
          <div className="image-top">
            <button
              onClick={() => handleWishlist()}
              style={{ backgroundColor: `rgba(0, 0, 0, 0)`, border: "none" }}
            >
              <FontAwesomeIcon
                icon={faHeart}
                color={isWishlist ? "magenta" : "gray"}
              />
            </button>
            <div className="average-rating">
              Rating: {averageRating.toFixed(2)}
            </div>
          </div>

          <ImageGallery images={product.images} />
        </div>
        <div className="owner-info">
          <div>
            <strong>{`Seller: ${product.owner.firstName} ${product.owner.lastName}`}</strong>
          </div>
          {!!user && product.owner._id !== user._id && (
            <Button
              size="sm"
              className="chat_seller"
              onClick={() => handleChat(product)}
            >
              Chat With Seller
            </Button>
          )}
          <button onClick={() => setIsProfileRatingModalOpen(true)}>
            Rate This Seller
          </button>
          <button
            onClick={() => navigate(`/user/profile/${product.owner._id}`)}
          >
            Visit Seller's Profile
          </button>

          <div className="product-rating-button">
            <button onClick={() => setIsReviewModalOpen(true)}>
              Review This Product
            </button>
            <button onClick={() => setIsRatingModalOpen(true)}>
              Rate This Product
            </button>
          </div>
        </div>
      </div>

      {/* Display reviews */}
      <ProductReviews reviews={reviews} />

      {/* Review modal */}
      <ProductReviewModal
        isOpen={isReviewModalOpen}
        onSubmit={handleReviewSubmit}
        reviewText={reviewText}
        setReviewText={setReviewText}
        setIsReviewModalOpen={setIsReviewModalOpen}
      />

      {/* Rating modal */}
      <ProductRatingModal
        isOpen={isRatingModalOpen}
        onSubmit={handleRatingSubmit}
        rating={rating}
        setRating={setRating}
        setIsRatingModalOpen={setIsRatingModalOpen}
      />

      {/* Seller's Profile Rating modal */}
      <UserRatingModal
        isOpen={isProfileRatingModalOpen}
        onSubmit={handleProfileRatingSubmit}
        rating={profileRating}
        setRating={setProfileRating}
        setIsRatingModalOpen={setIsProfileRatingModalOpen}
      />

      <Modal show={showMsg} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control
                as="textarea"
                className="cnts-btn"
                name="textarea"
                onChange={handleMsgChange}
                rows={3}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" className="cnts-btn" onClick={onMsgSent}>
            Send
          </Button>
          <Button
            variant="secondary"
            className="cnts-btn"
            onClick={handleClose}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductDetails;
