import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import Event from "../models/Event.js";
import Feedback from "../models/Feedback.js";

export const handleCancelTicket = async (req, res) => {
  const ticketId = req.params.ticketId;

  try {
    // Find and delete the ticket by its ID
    const ticket = await Ticket.findByIdAndDelete(ticketId);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // Return a success message
    res.status(200).json({ message: "Ticket canceled successfully" });
  } catch (err) {
    console.error("Error canceling ticket:", err);
    res.status(500).json({ error: "Error canceling ticket" });
  }
};

export const handlePaymentSuccess = async (req, res) => {
  try {
    const { eventId, ticketsBooked, totalAmount, usert, eventName } = req.body;

    // Create a new ticket record
    const newTicket = new Ticket({
      userId: usert.id,
      eventId,
      eventName,
      ticketsBooked,
      totalPrice: totalAmount, // Mark as paid after successful payment
    });

    await newTicket.save();
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    event.availableTickets -= ticketsBooked;
    event.attendees.push(usert.email);

    await event.save(); // Save the updated event

    return res
      .status(200)
      .json({ message: "Ticket booking and event update successful" });
    res
      .status(200)
      .json({ message: "Ticket booked successfully", ticket: newTicket });
  } catch (error) {
    console.error("Error saving ticket:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch all tickets for a specific user
export const getUserTickets = async (req, res) => {
  const { id } = req.params; // Get user ID from params
  if (!id || id === "undefined") {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  try {
    // Find tickets for the user and populate event details
    const tickets = await Ticket.find({ userId: id }).populate(
      "eventId",
      "name date location pricePerTicket"
    );

    // Format ticket data to include event details
    const formattedTickets = tickets.map((ticket) => ({
      _id: ticket._id,
      eventName: ticket.eventId.name,
      ticketsBooked: ticket.ticketsBooked,
      totalPrice: ticket.totalPrice,
      bookingDate: ticket.bookingDate,
      eventid: ticket.eventId,
      userid: ticket.userId,
    }));

    res.json(formattedTickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Failed to fetch tickets." });
  }
};
