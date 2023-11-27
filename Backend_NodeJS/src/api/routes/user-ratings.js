const { Router } = require("express");
const { addUserRating, deleteUserRating } = require("../controllers/user");

const router = Router();

//http://localhost:8080/api/user/

// AUTH

router.post("/", addUserRating);
router.delete("/", deleteUserRating);

module.exports = router;
