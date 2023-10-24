import { Router } from "express";
import { editUser, deleteUser, login } from "../controllers/user/index.js";

const router = Router();

//http://localhost:8080/api/user

// AUTH

router.post("/login", login);
router.put("/edit", editUser);
router.delete("/delete", deleteUser);

export default router;
