import express from "express";
const router = express.Router();
import registerController from "../controllers/auth/register.js";
import loginController from "../controllers/auth/login.js";
import refresh from "../controllers/auth/refresh.js";
import validate from "../validations/validator.js";
import { register, login } from "../validations/schemas.js";

router.post("/register", validate(register), registerController);
router.post("/login", validate(login), loginController);
router.post("/refresh", refresh);

export default router;
