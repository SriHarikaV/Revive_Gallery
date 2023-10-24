import { Router } from "express";

import user from "./user.js";
import post from "./post.js";
const router = Router();

router.use("/user", user);
// router.use("/post", post);

export default router;
