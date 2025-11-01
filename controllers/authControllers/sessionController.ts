import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../../model/userModel";

interface MyPayload extends jwt.JwtPayload {
  _id: string;
}

export const sessionController = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.TOKEN;

    console.log("Token :", token);
    if (!token) return res.status(404).json({ msg: "Token not found." });
    const secret = process.env.TOKEN_SECRET;
    console.log(secret);
    if (!secret) {
      throw new Error("TOKEN_SECRET is not defined in environment variables");
    }
    const decoded = jwt.verify(token, secret) as MyPayload;
    console.log("Decoded: ", decoded);
    const userId = decoded.id;
    const getUser = await User.findOne({ _id: userId }).select("-password");
    console.log("Session User :", getUser._id);

    return res.status(200).json({ user: getUser });
  } catch (err) {
    return res.status(500).json({ msg: "Invalid or expired token" });
  }
};
