import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/products/ProductsList.css";
import { useUser } from "../auth/UserContext";
import { Button, Form, Modal } from "react-bootstrap";
import { createChatRoom } from "../messages/services";

const ProductsList = () => {
  const { user, token } = useUser();

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const categoriesParam = searchParams.get("categories");

  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [showMsg, setShowMdg] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    let productsUrl;
    if (categoriesParam) {
      productsUrl = `http://localhost:8080/api/product?categories=${categoriesParam}`;
    } else {
      productsUrl = `http://localhost:8080/api/product`;
    }

    // Fetch all the products from the backend API
    fetch(productsUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed with status: " + response.status);
        }
        return response.json();
      })
      .then(async (data) => {
        console.log("Received data:", data);
        setProducts(data.products);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError(error.message);
      });
  }, [categoriesParam]);

  const handleChat = (product) => {
    setShowMdg(true);
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
  const handleClose = () => setShowMdg(false);

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
            <div className="product-info">
              <h2>{product.title}</h2>
              <p>${product.price}</p>
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

export default ProductsList;
