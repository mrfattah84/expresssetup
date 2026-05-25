import { Request, Response } from "express";
import db from "../../models/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtSecret, jwtRefreshSecret } from "../../config/index.js";
import { UAParser } from "ua-parser-js";

export default async (req: Request, res: Response) => {
  const user = await db.user.findUnique({
    where: { email: req.body.email },
    include: { sessions: true },
  });
  if (!user) {
    res.status(404).json({ msg: "please create an account first!" });
  } else {
    const pw = await bcrypt.compare(req.body.password, user.passwordHash);
    if (pw) {
      const token = jwt.sign({ uid: user.id, role: user.role }, jwtSecret, {
        expiresIn: "30m",
      });
      const refreshToken = jwt.sign(
        { uid: user.id, role: user.role },
        jwtRefreshSecret,
        { expiresIn: "7d" },
      );

      const ua = new UAParser(req.headers["user-agent"]);
      await db.session.create({
        data: {
          uid: user.id,
          token: refreshToken,
          device: `${ua.getDevice().toString()} ${ua.getBrowser().toString()}`,
          ip: req.ip || "",
        },
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // Prevents client-side JS from reading the cookie
        secure: true, // Forces HTTPS (Keep true in production)
        sameSite: "strict", // Protects against CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // Match JWT expiration (7 days)
      });

      res.status(200).json({ msg: "login successful", accesstoken: token });
    } else {
      res.status(400).json({ msg: "wrong username or password!" });
    }
  }
};
