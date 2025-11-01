import { Router } from "express";

import { LoginController } from "../controllers/authControllers/loginController";
import { sessionController } from "../controllers/authControllers/sessionController";
import { verifyToken } from "../middleware/verifyToken";
import { logoutController } from "../controllers/authControllers/logoutController";
export const authRouter = Router();

authRouter.post("/login", LoginController);
authRouter.get("/session", verifyToken, sessionController);
authRouter.post("/logout", logoutController);
