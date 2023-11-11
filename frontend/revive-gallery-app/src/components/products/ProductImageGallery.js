import React, { useState } from 'react';

const Image = ({ src, alt }) => (
  <div className="image-container">
    <img src={src} alt={alt} />
  </div>
);

const ImageGallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const createIterator = () => {
    let index = 0;

    const next = () => {
      index = (index + 1) % images.length;
      return images[index];
    };

    const prev = () => {
      index = (index - 1 + images.length) % images.length;
      return images[index];
    };

    return { next, prev };
  };

  const iterator = createIterator();

  return (
    <div className="image-gallery">
      <Image src={images[currentIndex]} alt={`Image ${currentIndex + 1}`} />
      <div className="navigation">
        <button onClick={() => setCurrentIndex(iterator.prev())} disabled={currentIndex === 0}>
          Prev
        </button>
        <button onClick={() => setCurrentIndex(iterator.next())} disabled={currentIndex === images.length - 1}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ImageGallery;
