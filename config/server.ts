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
import { ticketFundsRoute } from "../routes/ticketFundsRoutes";
import { ledgerRoutes } from "../routes/ledgerRoutes";
import { ticketRoutes } from "../routes/ticketRoutes";
import { brandRoutes } from "../routes/webRoutes/brandRoutes";
import { sliderRoutes } from "../routes/webRoutes/sliderRoutes";
import { counterRoutes } from "../routes/webRoutes/counterRoutes";
import { aboutRouter } from "../routes/webRoutes/aboutRoutes";
import { servicesRoutes } from "../routes/webRoutes/servicesRoutes";
import { whyChooseUsRoutes } from "../routes/webRoutes/whyChooseUsRoutes";
import { galleryRoutes } from "../routes/webRoutes/galleryRoutes";
import { faqRoutes } from "../routes/webRoutes/faqRoutes";
import { testimonialRoutes } from "../routes/webRoutes/testimonialsRoutes";
import { packageRoutes } from "../routes/webRoutes/packagesRoutes";

const app = express();
dotenv.config();
dbConnect();
const PORT = process.env.PORT || 7000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "https://bmwcmsbackend-production.up.railway.app",
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

// ticket fund
app.use("/api/funds", verifyToken, ticketFundsRoute);

// ticket ledger
app.use("/api/ledgers", verifyToken, ledgerRoutes);

// ticket routes
app.use("/api/tickets", verifyToken, ticketRoutes);
// -----------------------Route ends here----------------------- //

// brand routes
app.use("/api/brand", brandRoutes);

// slider routes]
app.use("/api/sliders", sliderRoutes);

// counterRoutes
app.use("/api/counters", counterRoutes);

// aboutRoutes
app.use("/api/abouts", aboutRouter);

// servicesRoutes
app.use("/api/services", servicesRoutes);

//  why choose us routes
app.use("/api/whychooseus", whyChooseUsRoutes);

// galleryRoutes
app.use("/api/galleries", galleryRoutes);

// faqRoutes
app.use("/api/faqs", faqRoutes);

// testimonialsRoutes
app.use("/api/testimonials", testimonialRoutes);

// packagesRoutes
app.use("/api/packages", packageRoutes);

app.use((req, res) => {
  console.log("Unmatched request:", req.method, req.path);
  res.status(404).json({ error: "Route not found by Express" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
