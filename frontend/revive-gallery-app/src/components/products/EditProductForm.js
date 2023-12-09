import React, { useState, useEffect } from 'react';
import "../../styles/products/ProductForm.css"
import { imgDB } from '../FirebaseConfig';
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes, deleteObject  } from 'firebase/storage';
import { useNavigate } from "react-router-dom";
import categories from '../../data/categories';
import { useUser } from "../auth/UserContext";

function EditProductForm({ productId }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    _id: productId,
    title: '',
    description: '',
    price: '',
    categories: [], // array to store selected categories
    images: [], // array to store selected images/image urls
    oldImages: [], // array to store existing image urls
    owner: user && user._id,
  });

  useEffect(() => {
    if (productId) {
      // Fetch product details based on productId
      fetch(`http://localhost:8080/api/product?_id=${productId}`)
        .then((response) => response.json())
        .then((data) => {
          const fetchedProduct = data.products[0];
          console.log('fetched product', fetchedProduct);
          setProduct({
            _id: fetchedProduct._id,
            title: fetchedProduct.title,
            description: fetchedProduct.description,
            price: fetchedProduct.price,
            categories: fetchedProduct.categories,
            images: [],
            oldImages: fetchedProduct.images,
            owner: fetchedProduct.owner._id,
          });
        })
        .catch((error) => console.error('Error fetching product details:', error));
    }
  }, [productId]);

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
    } else {
      e.target.setCustomValidity(''); // Reset the custom validation message
      setProduct({
        ...product,
        images: [...product.images, ...selectedImages],
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
      return imageUrls;
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const handleImgDelete = async (imageUrl) => {
    // Delete image from Firebase storage
    const imgRef = ref(imgDB, imageUrl);
    await deleteObject(imgRef);

    // Remove the image from the local state
    const updatedImages = product.oldImages.filter((img) => img !== imageUrl);
    setProduct({
      ...product,
      oldImages: updatedImages,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate the total number of images (existing + new)
    const totalImagesCount = product.images.length + product.oldImages.length;
    console.log('total product images', totalImagesCount, product.images);

    // Check if the total number of images is greater than or equal to 5
    if (totalImagesCount >= 5) {
      // Call handleImgUpload to upload and fetch URLs for all selected images
      const newImageUrls = await handleImgUpload(product.images);

      // Merge existing image URLs with new image URLs
      const updatedImageUrls = [...product.oldImages, ...newImageUrls];

      const formData = {
        ...product,
        images: updatedImageUrls,
      };

      const url = "http://localhost:8080/api/product";

      fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (response.ok) {
            navigate('/products');
            console.log("Success");
          } else {
            console.log("Bad response");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      // Display an error message if the total number of images is less than 5
      console.error('Please upload at least 5 images.');
    }
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
            value={product.title}
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
            {categories.map((category) => (
              <option key={category.name} value={category.name}>{category.name}</option>
            ))}
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

        <div className="form-group existing-product-images">
          <label htmlFor="images">Existing Product Images:</label>
          {product.oldImages.map((imageUrl) => (
            <div key={imageUrl} className="existing-image">
              <img src={imageUrl} alt="Product" />
              <span className="close-icon" onClick={() => handleImgDelete(imageUrl)}>
                &times;
              </span>
            </div>
          ))}
        </div>

        <div className="form-group">
          <label htmlFor="images">Want to add more images?</label>
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
            Edit Product
          </button>
        </div>

      </form>
    </div>
  );
}

export default EditProductForm;
