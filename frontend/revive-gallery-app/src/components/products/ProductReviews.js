import React from 'react';

const ProductReviews = ({ reviews }) => {
  const groupedReviews = {};
  
  // Group reviews by user
  reviews?.forEach((review) => {
    const userId = review.user._id;
    if (!groupedReviews[userId]) {
      groupedReviews[userId] = {
        userName: `${review.user.firstName} ${review.user.lastName}`,
        userReviews: [],
      };
    }

    groupedReviews[userId].userReviews.push({
      text: review.text,
      dateAdded: new Date(review.dateAdded).toLocaleDateString(),
    });
  });

  return (
    <div className="product-reviews">
      <h4>Reviews</h4>
      {Object.values(groupedReviews).map((userReviewGroup) => (
        <div key={userReviewGroup.userName} className="user-review-group">
          <p className="review-user">{userReviewGroup.userName}</p>
          {userReviewGroup.userReviews.map((review, index) => (
            <div key={index} className="review-item">
              <p className="review-text">{review.text}</p>
              <p className="review-date">{review.dateAdded}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ProductReviews;
