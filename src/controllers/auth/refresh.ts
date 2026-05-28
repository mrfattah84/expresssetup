import { Request, Response } from "express";
import db from "../../models/db.js";
import jwt from "jsonwebtoken";
import { jwtSecret, jwtRefreshSecret } from "../../config/index.js";
import { UAParser } from "ua-parser-js";

export default async (req: Request, res: Response) => {
  const cookies = req.cookies;

  // Check if refresh token exists in cookies
  if (!cookies?.refreshToken) return res.sendStatus(401);
  const refreshToken = cookies.refreshToken;

  // Verify JWT
  try {
    jwt.verify(refreshToken, jwtRefreshSecret);
  } catch (error) {
    res.sendStatus(403);
  }

  const uid = jwt.decode(refreshToken, { json: true })?.uid;

  const user = await db.user.findUnique({
    where: { id: uid },
    include: { sessions: true },
  });

  if (!user) {
    return res.sendStatus(400);
  }

  const session = user.sessions.find((val) => {
    return val.token === refreshToken;
  });

  // Check if refresh token is valid in our DB/Allowed list
  if (session?.token !== refreshToken || !session?.isValid) {
    return res.sendStatus(403); // Forbidden
  }

  // Issue a fresh access token
  const newToken = jwt.sign({ uid: user.id, role: user.role }, jwtSecret, {
    expiresIn: "30m",
  });
  const newRefreshToken = jwt.sign(
    { uid: user.id, role: user.role },
    jwtRefreshSecret,
    { expiresIn: "7d" },
  );

  const ua = new UAParser(req.headers["user-agent"]);
  await db.session.update({
    where: { id: session?.id },
    data: {
      token: newRefreshToken,
      device: `${ua.getDevice().toString()} ${ua.getBrowser().toString()}`,
      ip: req.ip || "",
    },
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true, // Prevents client-side JS from reading the cookie
    secure: true, // Forces HTTPS (Keep true in production)
    sameSite: "strict", // Protects against CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // Match JWT expiration (7 days)
  });

  res.status(200).json({ msg: "login successful", accesstoken: newToken });
};
