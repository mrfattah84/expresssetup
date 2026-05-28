import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/index.js";

export default (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Expect: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // Attach payload to request
    next();
  } catch (err) {
    // err.name === 'TokenExpiredError' | 'JsonWebTokenError' | 'NotBeforeError'
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
