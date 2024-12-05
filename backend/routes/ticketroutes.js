
import express from "express";
import {handlePaymentSuccess} from  "../controllers/ticketcontroller.js";

const router = express.Router();

// Endpoint for handling successful payment and storing ticket details
router.post("/paymentsuccess", handlePaymentSuccess);


export default router;
