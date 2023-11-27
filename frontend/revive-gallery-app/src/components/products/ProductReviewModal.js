import React, { useState } from 'react';

const ProductReviewModal = ({ isOpen, onClose, onSubmit }) => {
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = () => {
    // Validate reviewText
    if (reviewText.trim() === '') {
      // Handle validation error
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
        <h2>Review This Product</h2>
        <textarea
          placeholder="Write your review here..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit Review</button>
      </div>
    </div>
  );
};

export default ProductReviewModal;