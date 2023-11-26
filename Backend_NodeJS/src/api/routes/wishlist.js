const { Router } = require("express");
const {
  addProductToWishList,
  getUsersWishList,
  removeProductFromWishList,
} = require("../controllers/user");

const router = Router();

//http://localhost:8080/api/user/

// AUTH

router.get("/", getUsersWishList);
router.post("/", addProductToWishList);
router.delete("/", removeProductFromWishList);

module.exports = router;
