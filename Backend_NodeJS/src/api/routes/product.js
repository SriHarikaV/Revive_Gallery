const { Router } = require("express");
const {
  create,
  deleteProduct,
  editProduct,
  getProduct,
} = require("../controllers/products/index.js");

const router = Router();

// AUTH

router.post("/", create);
router.delete("/", deleteProduct);

module.exports = router;
