const { Router } = require("express");
const {
  register,
  getUser,
  editUser,
  deleteUser,
  login,
} = require("../controllers/user/index.js");

const router = Router();

//http://localhost:8080/api/user/

// AUTH

router.post("/register", register);
router.post("/login", login);
router.get("/get", getUser);
router.put("/edit", editUser);
router.delete("/delete", deleteUser);

module.exports = router;
