import React, { useEffect, useState } from "react";

const ProductsList = () => {
  const [products, setProducts] = useState([
    {"id": 1, "name": "watch", "description": "fast track watch, 9 years old", "price": 300},
    {"id": 2, "name": "phone", "description": "iphone 13, good condition", "price": 500},
    {"id": 3, "name": "phone", "description": "iphone 14", "price": 600},
    {"id": 4, "name": "watch", "description": "titan watch, 2 years old", "price": 100},

  ]);

  // useEffect(() => {
  //   // Fetch the product data from your backend API
  //   fetch("http://localhost:5000/products") // Replace with your API endpoint
  //     .then((response) => response.json())
  //     .then((data) => setProducts(data))
  //     .catch((error) => console.error("Error fetching products:", error));
  // }, []);

  // return (
  //   <div>
  //     <h1>Marketplace</h1>
  //     <div className="product-table">
  //       {products.map((product) => (
  //         <div key={product.id} className="product-item">
  //           <h2>{product.name}</h2>
  //           <p>{product.description}</p>
  //           <p>Price: ${product.price}</p>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
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
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>${product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsList;
