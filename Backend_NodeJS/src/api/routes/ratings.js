const { Router } = require("express");
const { addRating, deleteRating } = require("../controllers/user");

const router = Router();

//http://localhost:8080/api/user/

// AUTH

router.post("/", addRating);
router.delete("/", deleteRating);

module.exports = router;
