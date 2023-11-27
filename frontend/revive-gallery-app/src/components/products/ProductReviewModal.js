import React, { useState } from 'react';
import "../../styles/products/ProductReviewModal.css";

const ProductReviewModal = ({ isOpen, onSubmit, reviewText, setReviewText, setIsReviewModalOpen }) => {
  const [validationError, setValidationError] = useState('');

  const onClose=() => {
    setIsReviewModalOpen(false);
    setReviewText('');
    setValidationError('');
  }

  const handleSubmit = () => {
    // Validate reviewText
    if (reviewText.trim() === '') {
      // Handle validation error
      setValidationError('Review text cannot be empty');
      return;
    }

    // Call the onSubmit callback with the review text
    onSubmit(reviewText);

    // Close the modal
    onClose();
  };

  return (
    <div className={`review-modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <div className="review-header">
          <h4 className="review-this-product">Review this product</h4>
        </div>
        {validationError && (
          <div className="validation-error">{validationError}</div>
        )}
        <textarea className="product-review-textarea"
          placeholder="Write your review here..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />

        <button className="submit-product-review" onClick={handleSubmit}>Submit Review</button>
      </div>
    </div>
  );
};

export default ProductReviewModal;