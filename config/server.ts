import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnect } from "./dbConnect";
import { authRouter } from "../routes/authRoutes";
import { vehicleRouter } from "../routes/vehicleRoute";
import { vehicleMaintananceRoute } from "../routes/vehicleMaintananceRoutes";
import { verifyToken } from "../middleware/verifyToken";
import { clientRoutes } from "../routes/clientRoutes";
import { quotationRoutes } from "../routes/quotationRoutes";
import { tripRoutes } from "../routes/tripsRoutes";

const app = express();
dotenv.config();
dbConnect();
const PORT = process.env.PORT || 9000;

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
app.use("/api/vehicle", verifyToken, vehicleRouter);
// vehicle maintanance routes
app.use("/api/vehicle-maintanance", verifyToken, vehicleMaintananceRoute);

// quotation routes
app.use("/api/quotations", verifyToken, quotationRoutes);
// client routes
app.use("/api/clients", verifyToken, clientRoutes);

// trip routes
app.use("/api/trips", verifyToken, tripRoutes);

// -----------------------Route ends here----------------------- //

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
