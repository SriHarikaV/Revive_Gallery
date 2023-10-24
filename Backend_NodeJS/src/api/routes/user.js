import { Router } from "express";
import {
  register,
  getUser,
  editUser,
  deleteUser,
  login,
} from "../controllers/user/index.js";

const router = Router();

//http://localhost:8080/api/user

// AUTH

router.post("/register", register);
router.post("/login", login);
router.get("/get", getUser);
router.put("/edit", editUser);
router.delete("/delete", deleteUser);

export default router;
