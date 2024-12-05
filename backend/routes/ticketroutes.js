import express from "express";
import {
  handlePaymentSuccess,
  getUserTickets,
} from "../controllers/ticketcontroller.js";

const router = express.Router();

// Endpoint for handling successful payment and storing ticket details
router.post("/paymentsuccess", handlePaymentSuccess);
router.get("/user/:id", getUserTickets);

export default router;
