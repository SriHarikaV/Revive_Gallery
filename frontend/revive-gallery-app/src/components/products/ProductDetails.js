import React from 'react';
import ImageGallery from './ProductImageGallery';
import "../../styles/products/ProductDetails.css"
import watch1 from '../../static/images/watch1.jpg';
import watch2 from '../../static/images/watch2.jpg';
import watch3 from '../../static/images/watch3.jpg';
import watch4 from '../../static/images/watch4.jpg';
import watch5 from '../../static/images/watch5.jpg';

const ProductDetails = () => {
  const product = {
    title: 'Sample Product',
    description: 'This is a test product description.',
    images: [watch1, watch2, watch3, watch4, watch5],
  };
 
  const categories = [
    { id: 1, name: 'Category A' },
    { id: 2, name: 'Category B' },
  ];

  return (
    <div>
      
      <ImageGallery images={product.images} />
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <div>
        <h4>Categories</h4>
        <ul>
          {categories.map((category) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductDetails;
