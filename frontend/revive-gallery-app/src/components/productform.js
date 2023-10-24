import React, { useState } from 'react';
import "./productform.css"

function ProductForm() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    categories: [], // array to store selected categories
    price: '',
    images: [] // array to store selected images
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleCategoryChange = (e) => {
    const { name, options } = e.target;
    const selectedCategories = Array.from(options).filter((option) => option.selected).map((option) => option.value);
    setProduct({
      ...product,
      [name]: selectedCategories,
    });
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    setProduct({
      ...product,
      images: selectedImages,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send the product data to the backend API
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    product.categories.forEach((category) => formData.append("categories", category));
    product.images.forEach((image) => formData.append("images", image));

    fetch("http://localhost:5000/product/create", {
      method: "POST",
      body: formData, 
    })
      .then((response) => {
        if (response.ok) {
          console.log("Success");
          console.log('Form Data:', product);
        } else {
          console.log("Bad response");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="ProductForm">
      <h2>Add a New Product</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="categories">Categories:</label>
          <select
            id="categories"
            name="categories"
            multiple // Enable multiple selection
            value={product.categories}
            onChange={handleCategoryChange}
            className="form-control"
          >
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="images">Product Images:</label>
          <input
            type="file"
            id="images"
            name="images"
            multiple // Enable multiple file selection
            onChange={handleImageChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            Add Product
          </button>
        </div>

      </form>
    </div>
  );
}

export default ProductForm;
