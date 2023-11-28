export const calculateAverageProductsRating = (products) => {
    console.log('rating products', products);
    const totalRatings = products.reduce((acc, product) => {
      if (product.ratings && product.ratings.length > 0) {
        const productRating = product.ratings.reduce((sum, rating) => sum + rating.rating, 0);
        return acc + productRating / product.ratings.length;
      }
      return acc;
    }, 0);

    return (totalRatings / products.length || 0).toFixed(3);
  };

export const calculateAverageReviewRating = async (products) => {
    if (products.length === 0) {
      return 0;
    }
  
    let totalScores = 0;
    let totalReviews = 0;
  
    for (const product of products) {
      if (product.reviews && product.reviews.length > 0) {
        for (const review of product.reviews) {
            console.log('review', review);
          const analyzeUrl = 'http://localhost:8080/api/analyze';
          const analyzeResponse = await fetch(analyzeUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "review": review.text }),
          });
  
          if (analyzeResponse.ok) {
            const analyzeData = await analyzeResponse.json();
            totalScores += analyzeData.score;
            totalReviews += 1;
          }
        }
      }
    }
  
    return (totalReviews > 0 ? totalScores / totalReviews : 0).toFixed(3);
  };
  
export const calculateTrustworthinessScore = (
    averageUserProfileRating,
    averageProductRating,
    averageReviewRating
  ) => {
    // Assuming the range of each rating
    const userProfileMinRating = 0; 
    const userProfileMaxRating = 5; 
  
    const productMinRating = 0; 
    const productMaxRating = 5;
  
    const reviewMinRating = -2;
    const reviewMaxRating = 2;
  
    // Mapping to the range of 0 to 10 for each rating
    const minTrustworthinessScore = 0;
    const maxTrustworthinessScore = 10;
  
    // Linear transformation formula for each rating
    const mapToScore = (rating, min, max) =>
      ((rating - min) / (max - min)) * (maxTrustworthinessScore - minTrustworthinessScore) + minTrustworthinessScore;
  
    // Calculate trustworthiness score for each rating
    const userProfileScore = mapToScore(averageUserProfileRating, userProfileMinRating, userProfileMaxRating);
    const productScore = mapToScore(averageProductRating, productMinRating, productMaxRating);
    const reviewScore = mapToScore(averageReviewRating, reviewMinRating, reviewMaxRating);
  
    // Calculate the overall trustworthiness score (you can adjust the weights as needed)
    const overallScore = (userProfileScore + productScore + reviewScore) / 3;
  
    return overallScore.toFixed(3);
  };
  
  