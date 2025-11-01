import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.TOKEN;
    if (!token) {
      return res.status(404).json({ error: "Token not found." });
    }
    const secret = process.env.TOKEN_SECRET as string;
    if (!secret) {
      return res.status(404).json({ error: "Token secret not found." });
    }
    const decodeToken = jwt.verify(token, secret);
    if (!decodeToken) {
      return res.status(401).json({ error: "Token did not match." });
    }

    req.user = decodeToken;
    console.log(req.user);
    next();
  } catch (error) {
    console.log("Bad Request for verifying token", error);
    return res.status(500).json({ error: "Bad Requst for Verifying Token" });
  }
};
