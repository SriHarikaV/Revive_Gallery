import React, { useState } from 'react';
import "../../styles/products/ProductRatingModal.css";

const ProductRatingModal = ({ isOpen, onSubmit, rating, setRating, setIsRatingModalOpen }) => {
  const [validationError, setValidationError] = useState('');

  const onClose = () => {
    setIsRatingModalOpen(false);
    setRating(0);
    setValidationError('');
  };

  const handleSubmit = () => {
    // Validate rating
    if (!rating || rating < 0 || rating > 5) {
      setValidationError('Please select a valid rating');
      return;
    }

    // Call the onSubmit callback with the selected rating
    onSubmit(rating);

    // Close the modal
    onClose();
  };

  return (
    <div className={`rating-modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <div className="rating-header">
          <h4 className="rate-this-product">Rate this product</h4>
        </div>
        {validationError && (
          <div className="validation-error">{validationError}</div>
        )}
        <div className="rating-stars">
          {/* Add your rating star components here */}
          {/* Example: */}
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${rating >= star ? 'selected' : ''}`}
              onClick={() => setRating(star)}
            >
              &#9733;
            </span>
          ))}
        </div>
        <div className="custom-rating">
          <label htmlFor="customRating">Custom Rating (0-5):</label>
          <input
            type="number"
            id="customRating"
            step="0.1"
            min="0"
            max="5"
            value={rating}
            onChange={(e) => setRating(parseFloat(e.target.value))}
          />
        </div>

        <button className="submit-product-rating" onClick={handleSubmit}>Submit Rating</button>
      </div>
    </div>
  );
};

export default ProductRatingModal;
