import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductsList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch all the products from the backend API
    fetch("http://localhost:8080/api/product", {
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
        console.log('Received data:', data);
        setProducts(data.products);
        console.log('set products', products)
    })
    .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <div>
      <h1>Marketplace</h1>
      <table className="product-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Description</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.title}</td>
              <td>{product.description}</td>
              <td>${product.price}</td>
              <td><Link to={`/products/details?id=${product._id}`}>{product._id}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsList;
