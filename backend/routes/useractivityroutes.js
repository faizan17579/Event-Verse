import express from "express";
import { getUserActivities}  from "../controllers/userActivityController.js";

const router = express.Router();

// Route to get user activities
router.get("/user-activities/:userId", getUserActivities);




export default router;
