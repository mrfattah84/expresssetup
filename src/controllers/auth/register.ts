import { Request, Response } from "express";
import db from "../../models/db.js";
import bcrypt from "bcryptjs";

export default async (req: Request, res: Response) => {
  const { password, ...data } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.user
    .create({ data: { ...data, passwordHash: hashedPassword } })
    .catch((reason) => {
      res.status(500).send(reason);
    });

  res.status(201).json({ msg: "user created succesfully" });
};
