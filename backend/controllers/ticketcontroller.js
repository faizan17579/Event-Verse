import Ticket from "../models/ticket.js";
import User from "../models/User.js";
import Event from "../models/Event.js";

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
    }));

    res.json(formattedTickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Failed to fetch tickets." });
  }
};
