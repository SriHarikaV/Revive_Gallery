import React, { useState } from 'react';

const Image = ({ src, alt }) => (
  <div className="image-container">
    <img src={src} alt={alt} />
  </div>
);

const ImageGallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const createIterator = () => {

    const next = () => {
      setCurrentIndex((currentIndex + 1) % images.length);
      return images[currentIndex];
    };

    const prev = () => {
      setCurrentIndex((currentIndex - 1 + images.length) % images.length);
      return images[currentIndex];
    };

    return { next, prev };
  };

  const iterator = createIterator();

  return (
    <div className="image-gallery">
      <Image src={images[currentIndex]} alt={`Image ${currentIndex + 1}`} />
      <div className="navigation">
        <button onClick={() => iterator.prev()} disabled={currentIndex === 0}>
          Prev
        </button>
        <button onClick={() => iterator.next()} disabled={currentIndex === images.length - 1}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ImageGallery;
