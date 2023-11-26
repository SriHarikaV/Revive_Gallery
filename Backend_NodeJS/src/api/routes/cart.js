const { Router } = require("express");
const {
  getUserCart,
  addToCart,
  removeFromCart,
} = require("../controllers/user");

const router = Router();

//http://localhost:8080/api/user/

// AUTH

router.get("/", getUserCart);
router.post("/", addToCart);
router.delete("/", removeFromCart);

module.exports = router;
