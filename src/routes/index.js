import express from "express";
const router = express.Router();
import auth from "./auth/index.js";

router.use("/auth", auth);

export default router;
