const { Router } = require("express");

const user = require("./user.js");
const product = require("./product.js");
const message = require("./messages.js");
const wishlist = require("./wishlist.js");
const cart = require("./cart.js");
const rating = require("./ratings.js");
const review = require("./reviews.js");
const router = Router();

router.use("/user", user);
router.use("/product", product);
router.use("/messages", message);
router.use("/wishlist", wishlist);
router.use("/cart", cart);
router.use("/review", review);
router.use("/rating", rating);

module.exports = router;
