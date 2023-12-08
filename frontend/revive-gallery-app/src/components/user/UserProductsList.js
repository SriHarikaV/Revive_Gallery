import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/products/ProductsList.css";
import { useUser } from "../auth/UserContext";
import { Button, Form, Modal } from "react-bootstrap";
import { createChatRoom } from "../messages/services";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "../../styles/user/UserProfile.css";

const UserProductsList = ({ ownerId }) => {
  const { user, token } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [showMsg, setShowMsg] = useState(false);
  const [product, setProduct] = useState(null);

  const [products, setProducts] = useState([]);
  const [wishlistProductIds, setWishlistProductIds] = useState([]);

  useEffect(() => {
    let productsUrl = `http://localhost:8080/api/product?owner=${ownerId}`;

    const fetchData = async () => {
      try {
        // Fetch all the products from the backend API
        const response = await fetch(productsUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Request failed with status: " + response.status);
        }

        const data = await response.json();
        console.log("Products List:", data);
        // setProducts(data.products || []);
        productsWithDiscount(data.products); // Call productsWithDiscount after setting the products
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
      }
    };

    fetchData();

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
        setWishlistProductIds(
          wishlistData.wishlist.map((product) => product._id)
        );
        console.log("prev products", products);
        console.log("after products", products);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchWishlist();
    console.log("after fetch wishlist", products);
  }, []);

  const productsWithDiscount = (products) => {
    console.log("disc products before", products);

    const newDicountedProducts = products?.map((product) => {
      // Apply a 10% discount for products with a price greater than $500
      const discountThreshold = 500;
      const discountPercentage = 5;
      const discountedPrice =
        product.price > discountThreshold
          ? product.price - (product.price * discountPercentage) / 100
          : product.price;
      // product.discountedPrice = discountedPrice;

      return {
        ...product,
        discountedPrice,
      };
    });
    console.log("disc products after", products);
    // console.log('diccounted final', newDicountedProducts);
    setProducts(newDicountedProducts || []);
  };

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
        throw new Error(
          `Failed to ${
            wishlistProductIds.includes(product._id) ? "remove from" : "add to"
          } wishlist`
        );
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
            <button
              className="product-wishlist"
              onClick={() => handleWishlist(product._id)}
              style={{ backgroundColor: `rgba(0, 0, 0, 0)`, border: "none" }}
            >
              <FontAwesomeIcon
                icon={faHeart}
                color={
                  wishlistProductIds.includes(product._id) ? "magenta" : "gray"
                }
              />
            </button>
            <Link to={`/products/details?id=${product._id}`}>
              <div className="product-image">
                <img src={product.images[0]} alt={product.description} />
              </div>
            </Link>
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

            <div className="product-list-info">
              <h2>{product.title}</h2>
              <p>
                {product.price !== product.discountedPrice ? (
                  <>
                    <span className="original-price">
                      <del>${product.price}</del>
                    </span>{" "}
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

export default UserProductsList;
