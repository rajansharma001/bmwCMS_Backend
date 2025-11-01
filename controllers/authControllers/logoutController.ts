import { Request, Response } from "express";
export const logoutController = async (req: Request, res: Response) => {
  try {
    console.log("clicked");
    const logout = res.clearCookie("TOKEN", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({ success: "Logout Successfully." });
  } catch (error) {
    console.log("Logout error", error);
    return res.status(500).json({ error: "Bad Request for logout." });
  }
};
