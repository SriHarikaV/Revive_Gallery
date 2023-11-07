import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../../styles/products/ProductsList.css';

const ProductsList = () => {

  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all the products from the backend API
    fetch("http://localhost:8080/api/product", {
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
        console.log('Received data:', data);
        setProducts(data.products);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError(error.message);
      });
  }, []);

  return (
    <div>
      {error && <p>Error: {error}</p>}
      <div className="product-container">
        {products.map((product) => (
          <div key={product._id} className="product-item">
            <Link to={`/products/details?id=${product._id}`}>
              <div className="product-image">
                <img
                  src={product.images[0]} 
                  alt={product.description}
                />
              </div>
            </Link>
            <div className="product-info">
              <h2>{product.title}</h2>
              <p>${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
