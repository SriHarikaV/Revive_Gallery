const { Router } = require("express");
const { addReview, deleteReview } = require("../controllers/user");

const router = Router();

//http://localhost:8080/api/user/

// AUTH

router.post("/", addReview);
router.delete("/", deleteReview);

module.exports = router;
