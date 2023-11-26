// AUTH
const registerAuth = require("./auth/register.js");
exports.register = registerAuth;

const loginAuth = require("./auth/login.js");
exports.login = loginAuth;

const getUser = require("./get-user.js");
exports.getUser = getUser;

// EDIT
const editUser = require("./edit/edit-user.js");
exports.editUser = editUser;

// OTHER
const deleteUser = require("./delete-user.js");
exports.deleteUser = deleteUser;

const {
  addProductToWishList,
  getUsersWishList,
  removeProductFromWishList,
} = require("./wishlist.js");
const { addToCart, removeFromCart, getUserCart } = require("./cart.js");
const { addReview, deleteReview } = require("./reviews.js");
const { addRating, deleteRating } = require("./rating.js");
const { addUserRating, deleteUserRating } = require("./user-ratings.js");

exports.addProductToWishList = addProductToWishList;
exports.getUsersWishList = getUsersWishList;
exports.removeProductFromWishList = removeProductFromWishList;
exports.addToCart = addToCart;
exports.removeFromCart = removeFromCart;
exports.getUserCart = getUserCart;
exports.addReview = addReview;
exports.deleteReview = deleteReview;
exports.addRating = addRating;
exports.deleteRating = deleteRating;
exports.addUserRating = addUserRating;
exports.deleteUserRating = deleteUserRating;
