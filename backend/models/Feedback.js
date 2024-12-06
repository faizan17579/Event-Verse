import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event', // Reference to the Event schema
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User schema
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1, // Minimum rating value
    max: 5, // Maximum rating value
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500, // Limit the length of the comment
  },
  createdAt: {
    type: Date,
    default: Date.now, // Timestamp for when feedback was submitted
  },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;