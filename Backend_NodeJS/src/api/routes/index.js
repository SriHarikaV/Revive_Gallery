const { Router } = require("express");

const user = require("./user.js");
const product = require("./product.js");
const message = require("./messages.js");
const router = Router();

router.use("/user", user);
router.use("/product", product);
router.use("/messages", message);

module.exports = router;
