import React, { useEffect, useState } from "react";
import { useUser } from "../auth/UserContext";
import UserProductsList  from "./UserProductsList";
import "../../styles/user/UserProfile.css";
import {calculateAverageProductsRating, calculateAverageReviewRating, calculateTrustworthinessScore} from "../../utils/calculateScore";

const AdminProfile = () => {
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [averageProductsRating, setAverageProductsRating] = useState(0);
  const [averageUserProfileRating, setAverageUserProfileRating] = useState(0);
  const [averageProductReviewRating, setAverageProductReviewRating] = useState(0);
  const [trustworthinessScore, setTrustworthinessScore] = useState(0);

useEffect(() => {
    // Fetch user profile data using the API
    const userProfileUrl = `http://localhost:8080/api/user/get?_id=${user._id}`;

    fetchUserProfile(userProfileUrl);
  }, [user._id, averageProductsRating, averageUserProfileRating]);

  const fetchUserProfile = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Request failed with status: " + response.status);
      }
      const data = await response.json();
      setUserProfile(data.user);
        
      // Fetch products and calculate trustworthiness score
      fetchProductsAndCalculateScore(data.user._id);

      const averageUserProfileRatings = calculateAverageUserProfileRating(data.user.ratings);
        setAverageUserProfileRating(averageUserProfileRatings);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError(error.message);
    }
  };

  const fetchProductsAndCalculateScore = async (ownerId) => {
    try {
      const productsUrl = `http://localhost:8080/api/product?owner=${ownerId}`;
      const response = await fetch(productsUrl);
      if (!response.ok) {
        throw new Error("Request failed with status: " + response.status);
      }
      const productsData = await response.json();

      // Calculate trustworthiness score using the utility function
      const averageProductsRatings = calculateAverageProductsRating(productsData.products);
      setAverageProductsRating(averageProductsRatings);

      const averageProductReviewRatings = await calculateAverageReviewRating(productsData.products);
      setAverageProductReviewRating(averageProductReviewRatings);

      
      setTrustworthinessScore(averageProductsRatings);

      
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.message);
    }
  };

  // Helper function to calculate the average rating
    const calculateAverageUserProfileRating = (ratings) => {
        const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
        return (sum / ratings.length);
    };

  if (!userProfile) {
    return <p>Loading your profile...</p>;
  }

  return (
    <div>
        <div className="user-profile-container">
            <div className="user-profile-header">
                <h2>My Profile</h2>
            </div>
            <div className="user-details">
                <p className="user-name">Name: {`${userProfile.firstName} ${userProfile.lastName}`}</p>
                <p className="user-email">Email: {userProfile.email}</p>
                <p className="user-rating">
                    Profile Rating: {userProfile.ratings.length > 0 ? averageUserProfileRating : "N/A"}
                </p>
                <p className="user-rating">
                    Products Rating: {averageProductsRating}
                </p>
                <p className="user-rating">
                    Product Review Rating: {averageProductReviewRating}
                </p>
                <p className="trustworthyness-score">
                Trustworthyness: {calculateTrustworthinessScore(averageUserProfileRating, averageProductsRating, averageProductReviewRating)}/10
                </p>
            </div>
            <h4 className="user-products-header"> My Products </h4>
            {error && <p className="error-message">Error: {error}</p>}
        </div>
        <div>
            
            <UserProductsList ownerId={userProfile._id} />
        </div>
    </div>
    
  );
};

export default AdminProfile;
