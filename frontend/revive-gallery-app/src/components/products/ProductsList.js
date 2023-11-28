import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/products/ProductsList.css";
import { useUser } from "../auth/UserContext";
import { Button, Form, Modal } from "react-bootstrap";
import { createChatRoom } from "../messages/services";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const ProductsList = ({ products, wishlistProductIds, setWishlistProductIds  }) => {
  const { user, token } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [showMsg, setShowMsg] = useState(false);
  const [product, setProduct] = useState(null);

  const handleChat = (product) => {
    setShowMsg(true);
    setProduct(product);
  };

  const handleWishlist = async (productID) => {
    try {
      // Toggle the product in/out of the wishlist
      const wishlistUrl = `http://localhost:8080/api/wishlist`;
      const method = wishlistProductIds.includes(productID) ? "DELETE" : "POST";

      const response = await fetch(wishlistUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user._id,
          productId: productID,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${wishlistProductIds.includes(product._id) ? "remove from" : "add to"} wishlist`);
      }

      setWishlistProductIds((prevIds) =>
        prevIds.includes(productID)
          ? prevIds.filter((id) => id !== productID)
          : [...prevIds, productID]
      );

    } catch (error) {
      setError(error.message);
    }
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
    <div>
      {error && <p>Error: {error}</p>}
      <div className="product-container">
        {products.map((product) => (
          <div key={product._id} className="product-item">
            {/* <p>{product.owner.email}</p> */}
            <button className="product-wishlist"
              onClick={() => handleWishlist(product._id)}
              style={{ backgroundColor: `rgba(0, 0, 0, 0)`, border: 'none' }}
            >
              <FontAwesomeIcon icon={faHeart} color={wishlistProductIds.includes(product._id) ? 'magenta' : 'gray'} />
            </button>
            <Link to={`/products/details?id=${product._id}`}>
              <div className="product-image">
                <img src={product.images[0]} alt={product.description} />
              </div>
            </Link>
            
            <div className="product-list-info">
              <h2>{product.title}</h2>
              <p>
                {product.price !== product.discountedPrice ? (
                  <>
                    <span className="original-price">
                    <del>${product.price}</del>
                    </span>
                    {" "}
                    <span className="discounted-price">
                    <strong>${product.discountedPrice}</strong>
                    </span>
                  </>
                ) : (
                  <span className="normal-price">
                    <strong>${product.price}</strong>
                  </span>
                )}
              </p>
            </div>

            {console.log(product.owner._id, user._id)}
            {!!user && product.owner._id !== user._id && (
              <Button
                size="sm"
                className="chat_seller"
                onClick={() => handleChat(product)}
              >
                Chat With Seller
              </Button>
            )}
          </div>
        ))}
      </div>

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

// Discount decorator
const withDiscount = (WrappedComponent) => {
  return () => {
    const { user, token } = useUser();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const categoriesParam = searchParams.get("categories");
    const ownerId = searchParams.get("owner");
    const userId = searchParams.get("userId");
    const isWishlistRoute = location.pathname.includes("/products/wishlist");
    const isCartRoute = location.pathname.includes("/products/cart");

    const [products, setProducts] = useState([]);
    const [wishlistProductIds, setWishlistProductIds] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
      let productsUrl;
      if (categoriesParam) {
        productsUrl = `http://localhost:8080/api/product?categories=${categoriesParam}`;
      } else if(ownerId){
        productsUrl = `http://localhost:8080/api/product?owner=${ownerId}`;
      }else if(isWishlistRoute && userId){
        productsUrl = `http://localhost:8080/api/wishlist?userId=${userId}`;
      }else if(isCartRoute && userId){
        productsUrl = `http://localhost:8080/api/cart?userId=${userId}`;
      }else {
        productsUrl = `http://localhost:8080/api/product`;
      }

      // Fetch all the products from the backend API
      fetch(productsUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Request failed with status: " + response.status);
          }
          return response.json();
        })
        .then(async (data) => {
          console.log("Products List:", data);
          if(isWishlistRoute && userId){
            setProducts(data.wishlist || []);
          }else if(isCartRoute && userId){
            setProducts(data.cart || []);
          }else{
            setProducts(data.products || []);
          }
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          setError(error.message);
        });

        const fetchWishlist = async () => {
          try {
            const wishlistUrl = `http://localhost:8080/api/wishlist?userId=${user._id}`;
            const response = await fetch(wishlistUrl, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            if (!response.ok) {
              throw new Error("Failed to fetch wishlist");
            }

            const wishlistData = await response.json();
            setWishlistProductIds(wishlistData.wishlist.map((product) => product._id));
          } catch (error) {
            setError(error.message);
          }
        };
    
        fetchWishlist();

    }, [categoriesParam, ownerId, userId, isWishlistRoute, isCartRoute]);

    const productsWithDiscount = products?.map((product) => {
      // Apply a 10% discount for products with a price greater than $500
      const discountThreshold = 500;
      const discountPercentage = 5;
      const discountedPrice =
        product.price > discountThreshold
          ? product.price - (product.price * discountPercentage) / 100
          : product.price;

      return {
        ...product,
        discountedPrice,
      };
    });

    return (
      <WrappedComponent
        products={productsWithDiscount}
        wishlistProductIds={wishlistProductIds}
        setWishlistProductIds={setWishlistProductIds}
      />
    );
  };
};

const DecoratedProductsList = withDiscount(ProductsList);

export default DecoratedProductsList;