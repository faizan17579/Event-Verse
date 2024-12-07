import express from "express";
import {
  addFeedback,
  getFeedbackByEvent,
  getAllFeedback,
  deleteFeedback
} from "../controllers/Feedbackcontroller.js";

const router = express.Router();

// Route to add feedback
router.post("/add", addFeedback);

// Route to fetch feedback for a specific event
router.get("/event/:eventId", getFeedbackByEvent);

router.get("/all", getAllFeedback);
router.delete("/delete/:feedbackId", deleteFeedback);

export default router;
