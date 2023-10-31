import React, { useState } from 'react';

const ImageGallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="image-gallery">
      <div className="image-container">
        <img 
          src={images[currentIndex]} 
          alt={`Image ${currentIndex + 1}`}
        />
      </div>
      <div className="navigation">
        <button onClick={prevSlide} disabled={currentIndex === 0}>
          Prev
        </button>
        <button onClick={nextSlide} disabled={currentIndex === images.length - 1}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ImageGallery;
