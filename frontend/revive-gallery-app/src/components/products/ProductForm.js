import React, { useEffect, useState } from 'react';
import "../../styles/products/ProductForm.css"
import { imgDB } from '../FirebaseConfig';
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

function ProductForm() {
  const [product, setProduct] = useState({
    title: '',
    description: '',
    price: '',
    categories: [], // array to store selected categories
    images: [], // array to store selected images/image urls
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
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']; 

    const invalidImages = selectedImages.filter((image) => !allowedImageTypes.includes(image.type));

    if (invalidImages.length > 0) {
      e.target.setCustomValidity('Please upload only image files (JPEG, PNG, GIF, or WebP).');
    } else if (selectedImages.length < 5) {
      e.target.setCustomValidity('Please upload at least 5 images.');
    } else {
      e.target.setCustomValidity(''); // Reset the custom validation message
      setProduct({
        ...product,
        images: selectedImages,
      });
    }
  };

  const handleImgUpload = async (images) => {
    const uploadPromises = images.map((image) => {
      return new Promise((resolve, reject) => {
        const imgRef = ref(imgDB, `products/Img${v4()}`);
        uploadBytes(imgRef, image)
          .then((data) => {
            getDownloadURL(data.ref)
              .then((url) => {
                resolve(url);
              })
              .catch((error) => {
                reject(error);
              });
          })
          .catch((error) => {
            reject(error);
          });
      });
    });

    try {
      const imageUrls = await Promise.all(uploadPromises);
      console.log("image urls", imageUrls)
      return imageUrls
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call handleImgUpload to upload and fetch URLs for all selected images
    const imageUrls = await handleImgUpload(product.images);

    const formData = product;
    formData['images'] = imageUrls;
    console.log(formData);

    
    fetch("http://localhost:8080/api/product", {
      method: "POST",
      body: formData, 
    })
      .then((response) => {
        if (response.ok) {
          console.log("Success");
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
          <label htmlFor="title">Product Name:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={product.name}
            onChange={handleInputChange}
            className="form-control"
            required
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
            required
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
            required
          >
            <option value="Electronics">Electronics</option>
            <option value="Watches">Watches</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Furniture">Furniture</option>
            <option value="HomeDecor">HomeDecor</option>
            <option value="Toys">Toys</option>
            <option value="Shoes">Shoes</option>
            <option value="Jewellery">Jewellery</option>
            <option value="Stationery">Stationery</option>
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
            required
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
            required
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
