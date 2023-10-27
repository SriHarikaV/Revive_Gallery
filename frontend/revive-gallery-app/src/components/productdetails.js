import React from 'react';
import ImageGallery from './productimagegallery';
// import image1 from '../images/avengers.jpg';
// import image2 from '../images/slu.png';

const ProductDetails = () => {
  const product = {
    title: 'Sample Product',
    description: 'This is a test product description.',
    // Assuming you have image files in the "images" folder
    images: [
    //   `${process.env.PUBLIC_URL}/images/avengers.jpg`,
    //   `${process.env.PUBLIC_URL}/images/plagiarism.png`,
    //   `${process.env.PUBLIC_URL}/images/slu.png`,
    //   '../images/slu.png',
    //   '../images/plagiarism.png',
    //   '../images/avengers.jpg',
    '/images/slu.png',
    '/images/plagiarism.png',
    '/images/avengers.jpg',
    //   './avengers.jpg'
    ],
  };

  const categories = [
    { id: 1, name: 'Category A' },
    { id: 2, name: 'Category B' },
  ];

  return (
    <div>
      <h1>{product.title}</h1>
      <ImageGallery images={product.images} />
      {/* <div>
        {product.images.map((image, index) => (
          <img
            key={index}
            src = {image}
            alt={product.title}
            height = "200"
            width = "200"
            // style={{ maxWidth: '100%' }}
          />
        ))}
      </div> */}
      <p>{product.description}</p>
      <div>
        <h2>Categories</h2>
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
