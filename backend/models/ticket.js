// models/Ticket.js (Node.js with Mongoose for MongoDB)

import mongoose from "mongoose";
const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event", // Assuming you have an Event model
    required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
  ticketsBooked: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  sponsor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    default: null, // Optional field to track sponsor involvement
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
