import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnect } from "./dbConnect";
import { authRouter } from "../routes/authRoutes";
import { vehicleRouter } from "../routes/vehicleRoute";

const app = express();
dotenv.config();
dbConnect();
const PORT = process.env.PORT || 7000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// -----------------------Route starts here----------------------- //

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World! this is backend server");
});

// auth routes
app.use("/api/auth", authRouter);

// vehicle routes
app.use("/api/vehicle", vehicleRouter);

// -----------------------Route ends here----------------------- //

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
