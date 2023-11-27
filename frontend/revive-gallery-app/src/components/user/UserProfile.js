import React, { useEffect, useState } from "react";
import { useUser } from "../auth/UserContext";
import UserProductsList  from "./UserProductsList"; // Import the decorated ProductsList

const UserProfile = () => {
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user profile data using the API
    const userProfileUrl = `http://localhost:8080/api/user/get?_id=${user._id}`;

    fetch(userProfileUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed with status: " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        setUserProfile(data.user);
        console.log('user profile', userProfile);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        setError(error.message);
      });
  }, [user._id]);

  if (!userProfile) {
    return <p>Loading user profile...</p>;
  }

  return (
    <div>
        <div className="user-profile-container">
            <div className="user-profile-header">
                <h2>User Profile</h2>
            </div>
            <div className="user-details">
                <p className="user-name">Name: {`${userProfile.firstName} ${userProfile.lastName}`}</p>
                <p className="user-email">Email: {userProfile.email}</p>
                <p className="user-rating">
                User Rating: {userProfile.ratings.length > 0 ? calculateAverageRating(userProfile.ratings) : "N/A"}
                </p>
                
            </div>
            {error && <p className="error-message">Error: {error}</p>}
        </div>
        <div>
            <h3> Products Listed </h3>
            <UserProductsList ownerId={userProfile._id} />
        </div>
    </div>
    
  );
};

// Helper function to calculate the average rating
const calculateAverageRating = (ratings) => {
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return (sum / ratings.length).toFixed(2);
};

export default UserProfile;
