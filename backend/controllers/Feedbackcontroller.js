import Feedback from "../models/Feedback.js";
import User from "../models/User.js"
import Event from "../models/Event.js";

// Add feedback
export const addFeedback = async (req, res) => {
  try {
    const { eventId, userId, rating, comment } = req.body;

    // Validate input
    if (!eventId || !userId || !rating || !comment) {
      return res.status(400).json({ error: "All fields are required." });
    }
  
    // Save feedback
    const feedback = new Feedback({ eventId, userId, rating, comment });
    await feedback.save();

    res.status(201).json({ message: "Feedback added successfully.", feedback });
  } catch (error) {
    res.status(500).json({ error: "Error adding feedback.", details: error.message });
  }
};

// Fetch feedback for a specific event
export const getFeedbackByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Fetch feedback by event ID
    const feedbacks = await Feedback.find({ eventId }).populate("userId", "name email");

    res.status(200).json({ feedbacks });
  } catch (error) {
    res.status(500).json({ error: "Error fetching feedback.", details: error.message });
  }
};
// Fetch all feedback
export const getAllFeedback = async (req, res) => {
    try {
      // Fetch all feedback and populate user and event details
      const feedbacks = await Feedback.find()
        .populate("userId", "name email") // Populating user details
        .populate("eventId", "name"); // Populating event details
  
      res.status(200).json({ feedbacks });
    } catch (error) {
      res.status(500).json({ error: "Error fetching all feedback.", details: error.message });
    }
  };

  // Delete feedback by feedback ID
export const deleteFeedback = async (req, res) => {
    try {
      const { feedbackId } = req.params;
  
      // Find and delete the feedback by ID
      const feedback = await Feedback.findByIdAndDelete(feedbackId);
  
      if (feedback) {
        return res.status(200).json({ message: "Feedback deleted successfully." });
      } else {
        return res.status(404).json({ error: "Feedback not found." });
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting feedback.", details: error.message });
    }
  };