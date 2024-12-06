import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  availableTickets: { type: Number, required: true },
  amount: { type: Number, required: true }, // Amount per ticket in cents
  attendees: { type: [String], default: [] }, // Array of email addresses of attendees
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Organizer's id
  organizerName: { type: String, required: true },
  isEnded: { type: Boolean, default: false }, // Event ended status
  isApproved: { type: Boolean, default: false }, // Admin approval status
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
