import express from "express";
import validate from "../validations/validator.js";
import { register } from "../validations/schemas.js";
const router = express.Router();

router.post("/", validate(register), (req, res) => {
  console.log(req.body);
  res.json({ msg: "ok" });
});

export default router;
