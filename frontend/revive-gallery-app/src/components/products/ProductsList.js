import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/products/ProductsList.css";
import { useUser } from "../auth/UserContext";
import { Button, Form, Modal } from "react-bootstrap";
import { createChatRoom } from "../messages/services";

// Discount decorator
const withDiscount = (WrappedComponent) => {
  return ({ products, ...props }) => {
    const productsWithDiscount = products.map((product) => {
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

    return <WrappedComponent products={productsWithDiscount} {...props} />;
  };
};

const DecoratedProductsList = withDiscount(ProductsList);

const ProductsList = ({ products }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [showMsg, setShowMsg] = useState(false);
  const [product, setProduct] = useState(null);

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
    <div>
      {error && <p>Error: {error}</p>}
      <div className="product-container">
        {products.map((product) => (
          <div key={product._id} className="product-item">
            <p>{product.owner.email}</p>

            <Link to={`/products/details?id=${product._id}`}>
              <div className="product-image">
                <img src={product.images[0]} alt={product.description} />
              </div>
            </Link>

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
                {product.discountedPrice && (
                  <span className="original-price">
                    ${product.discountedPrice}
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

export default DecoratedProductsList;
