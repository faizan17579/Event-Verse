import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import ticketRoute from "./routes/ticketroutes.js";
import feedbackRoutes from "./routes/FeedbackRoutes.js";

 import sponsorRoutes from "./routes/sponsorRoutes.js";
import ActivitiesRoutes from "./routes/useractivityroutes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoute);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/activities", ActivitiesRoutes);
app.use("/api/sponsor", sponsorRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
