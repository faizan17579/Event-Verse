import express from "express";
import {
  handlePaymentSuccess,
  getUserTickets,
  handleCancelTicket,
} from "../controllers/ticketcontroller.js";

const router = express.Router();

// Endpoint for handling successful payment and storing ticket details
router.post("/paymentsuccess", handlePaymentSuccess);
router.get("/user/:id", getUserTickets);
router.delete("/cancel/:ticketId", handleCancelTicket);

export default router;
