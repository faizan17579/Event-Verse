import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import Event from "../models/Event.js";
import Feedback from "../models/Feedback.js";

// Get activities for a user
export const getUserActivities = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    // if user is organizer
    if (user.role === "Organizer") {
      const events = await Event.find({ createdBy: userId }).sort({
        createdAt: -1,
      });

      if (!events) {
        return res.status(404).json({ message: "No activities found" });
      }

      const activities = events.map((event) => ({
        type: "Event",
        action: event.name,
        date: event.date,
      }));

      return res.status(200).json({ activities });
    }

    // Fetch tickets and feedbacks for the given user ID
    const tickets = await Ticket.find({ userId }).sort({ createdAt: -1 });
    const feedbacks = await Feedback.find({ userId }).sort({ createdAt: -1 });

    // Combine tickets and feedbacks into a single array
    if (!tickets && !feedbacks) {
      return res.status(404).json({ message: "No activities found" });
    }
    const activities = [
      ...tickets.map((ticket) => ({
        type: "Ticket",
        action: ticket.eventName,
        description: ticket.ticketsBooked,
        date: ticket.bookingDate,
      })),
      ...feedbacks.map((feedback) => ({
        type: "Feedback",
        message: feedback.comment,
        date: feedback.createdAt,
      })),
    ];

    // Sort activities by creation date
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    return res.status(200).json({ activities });
  } catch (err) {
    console.error("Error fetching activities:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
