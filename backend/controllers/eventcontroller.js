import Event from "../models/Event.js";
import User from "../models/User.js";
import Stripe from "stripe";
import PDFDocument from "pdfkit";
import Feedback from "../models/Feedback.js";
import Ticket from "../models/Ticket.js";

const stripe = new Stripe(
  "sk_test_51QS0yZJDUj9ArTtKD6jx9SHeZFMGmcETkZF9Bag1pvU8yG1KtBpus7fPE75VwavXVwoeuWfl4SwHBSzI7CHQk0Rw00z4tWPCLM"
);

export const getTrendingEvents = async (req, res) => {
  try {
    // Fetch feedback for events that have a rating greater than 3
    const feedback = await Feedback.find({ rating: { $gt: 2 } });
    if (!feedback.length) {
      return res
        .status(404)
        .json({ message: "No feedback with a rating greater than 3." });
    }

    // Extract the eventIds of those events
    const trendingEventsIds = feedback.map((feedback) => feedback.eventId);

    // Fetch events based on those eventIds
    const events = await Event.find({ _id: { $in: trendingEventsIds } });

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching trending events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const approveEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.isApproved = true; // Approve the event
    await event.save();

    res.status(200).json({ message: "Event approved successfully", event });
  } catch (error) {
    console.error("Error approving event:", error);
    res.status(500).json({ message: "Error approving event" });
  }
};

export const disapproveEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.isApproved = false; // Disapprove the event
    await event.save();

    res.status(200).json({ message: "Event disapproved successfully", event });
  } catch (error) {
    console.error("Error disapproving event:", error);
    res.status(500).json({ message: "Error disapproving event" });
  }
};

// Route: Download E-Ticket
export const downloadTicket = async (req, res) => {
  const { eventId, attendeeEmail } = req.body;

  try {
    if (!eventId || !attendeeEmail) {
      return res
        .status(400)
        .json({ message: "Event ID and attendee email are required." });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    if (!event.attendees.includes(attendeeEmail)) {
      return res
        .status(404)
        .json({ message: "No booking found for the provided email." });
    }

    const doc = new PDFDocument();
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="E-Ticket-${eventId}.pdf"`,
      });
      res.send(pdfBuffer);
    });

    doc.fontSize(20).text("E-Ticket", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Event Name: ${event.name}`);
    doc.text(`Date: ${event.date.toDateString()}`);
    doc.text(`Location: ${event.location}`);
    doc.text(`Type: ${event.type}`);
    doc.text(`Ticket Price: $${(event.amount / 100).toFixed(2)}`);
    doc.moveDown();
    doc.text(`Attendee: ${attendeeEmail}`);
    doc.moveDown();
    doc.text("Thank you for booking with us!");
    doc.end();
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while generating the E-Ticket." });
  }
};

// Route: Download E-Ticket
export const downloadAnalytics = async (req, res) => {
  const {
    orgId,
    orgName,
    organizerEmail,
    totalRevenue,
    totalfeedback,
    totalTicketsSold,
  } = req.body;

  try {
    if (!organizerEmail) {
      return res.status(400).json({ message: " attendee email are required." });
    }

    const doc = new PDFDocument();
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="E-Ticket-${organizerEmail}.pdf"`,
      });
      res.send(pdfBuffer);
    });

    doc.fontSize(20).text("Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Organizer Email: ${organizerEmail}`);
    doc.text(`Organizer Name: ${orgName}`);
    doc.text(`Total Revenue: ${totalRevenue}`);
    doc.text(`Total Feedback: ${totalfeedback}`);
    doc.text(`Total Tickets Sold: ${totalTicketsSold}`);
    doc.end();
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while generating the Analytic." });
  }
};
// Fetch events with optional filters
export const searchEvents = async (req, res) => {
  try {
    const { date, location, type } = req.query;
    const filter = {};
    if (date) filter.date = new Date(date);
    if (location) filter.location = location;
    if (type) filter.type = type;

    const events = await Event.find(filter);
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const bookTickets = async (req, res) => {
  try {
    const { eventId, tickets, attendeeEmail } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.availableTickets < tickets) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    const totalAmount = event.amount * tickets;
    const amountInCents = Math.round(totalAmount * 100);

    if (!Array.isArray(event.attendees)) {
      event.attendees = [];
    }

    // event.attendees.push(attendeeEmail);
    // event.availableTickets -= tickets;

    //await event.save();

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      eventId,
      tickets,
      attendeeEmail,
      totalAmount,
    });
  } catch (error) {
    console.error("Error booking tickets:", error); // Add more logs for better visibility
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
// Create a new event (Organizer only)
export const createEvent = async (req, res) => {
  const { name, date, location, type, availableTickets, amount, organizerid } =
    req.body;

  try {
    const organizer = await User.findOne({
      _id: organizerid,
      role: "Organizer",
    });

    if (!organizer) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Only organizers can create events" });
    }

    const event = new Event({
      name,
      date,
      location,
      type,
      availableTickets,
      amount,
      createdBy: organizerid,
      organizerName: organizer.name,
      isEnded: false,
    });

    await event.save();

    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch all events created by the organizer
export const getOrganizerEvents = async (req, res) => {
  const { email } = req.params;

  try {
    const organizer = await User.findOne({ email, role: "Organizer" });
    if (!organizer) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Only organizers can view this data" });
    }

    const events = await Event.find({ organizerEmail: email });
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching organizer events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch registered events for an attendee
export const getRegisteredEvents = async (req, res) => {
  const attendeeEmail = req.params.email;

  try {
    //
    const registeredEvents = await Event.find({ attendees: attendeeEmail });
    res.status(200).json({ registeredEvents });
  } catch (error) {
    console.error("Error fetching registered events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch all events
export const getAllEvents = async (req, res) => {
  try {
    // not shown which are not approved and also not ended
    const events = await Event.find({ isApproved: true, isEnded: false });

    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch events." });
  }
};
export const geteventforadmin = async (req, res) => {
  try {
    // not shown which are not approved and also not ended
    const events = await Event.find();

    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch events." });
  }
};
export const geteventfororg = async (req, res) => {
  try {
    // not shown which are not approved and also not ended
    const events = await Event.find({ isApproved: true });

    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch events." });
  }
};

// End an event
export const endEvent = async (req, res) => {
  const { id } = req.params;
  const { organizerId } = req.body;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    if (event.createdBy.toString() !== organizerId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to end this event." });
    }

    event.isEnded = true;
    await event.save();

    res.status(200).json({ message: "Event ended successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to end the event." });
  }
};

// Edit event by specific organizer
export const editEvent = async (req, res) => {
  const { id } = req.params;
  const { name, date, location, type, availableTickets, amount } = req.body;
  const { organizerId } = req.body;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    if (event.createdBy.toString() !== organizerId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this event." });
    }

    event.name = name;
    event.date = date;
    event.location = location;
    event.type = type;
    event.availableTickets = availableTickets;
    event.amount = amount;

    await event.save();

    res.status(200).json({ message: "Event updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update the event." });
  }
};
export const getTicketSales = async (req, res) => {
  try {
    const { eventName, dateRange, organizerId } = req.query;

    if (!organizerId) {
      return res.status(400).json({ error: "Organizer ID is required" });
    }

    // Build filter object
    const filter = { createdBy: organizerId }; // Filter for specific organizer
    if (eventName) {
      filter.name = { $regex: eventName, $options: "i" }; // Case-insensitive search
    }
    if (dateRange) {
      const [startDate, endDate] = dateRange.split(",");
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Query data from database
    const events = await Event.find(filter);

    // Calculate total revenue, tickets sold, and events
    const totalRevenue = events.reduce(
      (sum, event) => sum + event.amount * (event.attendees?.length || 0),
      0
    );
    const totalTicketsSold = events.reduce(
      (sum, event) => sum + (event.attendees?.length || 0),
      0
    );
    const totalEvents = events.length;

    // Format data for the response
    const formattedData = events.map((event) => ({
      eventName: event.name,
      ticketsSold: event.attendees?.length || 0,
      remainingTickets: event.availableTickets || 0, // Use the availableTickets field directly
      revenue: event.amount * (event.attendees?.length || 0),
      date: event.date,
      location: event.location || "Not specified", // Fallback for location
    }));

    // Send response
    res.status(200).json({
      summary: {
        totalRevenue,
        totalTicketsSold,
        totalEvents,
      },
      salesData: formattedData,
    });
  } catch (error) {
    console.error("Error fetching ticket sales:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getEventAnalytics = async (req, res) => {
  try {
    const { organizerId } = req.params;

    if (!organizerId) {
      return res.status(400).json({ error: "Organizer ID is required" });
    }

    const filter = { createdBy: organizerId };
    const events = await Event.find(filter);
    // Fetch feedback with respect to events
    const eventIds = events.map((event) => event._id);

    // Step 2: Get feedback for these events
    const feedback = await Feedback.find({ eventId: { $in: eventIds } });

    // Step 3: Map feedback to include eventName and other details
    const feedbackData = feedback.map((item) => ({
      comment: item.comment,
    }));

    if (!events || events.length === 0) {
      return res
        .status(404)
        .json({ error: "No events found for the organizer" });
    }

    const totalRevenue = events.reduce(
      (sum, event) =>
        sum + (event.amount || 0) * (event.attendees?.length || 0),
      0
    );

    const totalTicketsSold = events.reduce(
      (sum, event) => sum + (event.attendees?.length || 0),
      0
    );

    const totalEvents = events.length;

    const checkInsCompleted = feedback.length;

    const netProfit =
      totalRevenue -
      events.reduce((sum, event) => sum + (event.expenses || 0), 0);

    const ticketSalesData = events.map((event) => ({
      date: event.date?.toISOString().split("T")[0] || "Unknown Date",
      ticketsSold: event.attendees?.length || 0,
    }));

    // Fetch all ticket data from the database
    const tickets = await Ticket.find();

    // Reduce the ticket data to calculate revenue distribution
    const revenueDistribution = tickets.reduce((acc, ticket) => {
      // Find if the ticket type already exists in the accumulator
      const existing = acc.find((item) => item.eventName === ticket.eventName);
      if (existing) {
        // Update the existing entry with additional revenue and tickets
        existing.revenue += ticket.totalPrice;
        existing.ticketsBooked += ticket.ticketsBooked;
      } else {
        // Add a new entry for this event
        acc.push({
          eventName: ticket.eventName,
          revenue: ticket.totalPrice,
          ticketsBooked: ticket.ticketsBooked,
        });
      }
      return acc;
    }, []);

    const feedbackSummary = {
      //add comment from feedback data to word cloud
      wordCloud: feedbackData.map((item) => item.comment),

      overallRating: (
        feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length
      ).toFixed(2),
    };

    res.status(200).json({
      summary: {
        totalRevenue,
        totalTicketsSold,
        checkInsCompleted,
        netProfit,
        totalEvents,
      },
      ticketSalesData,
      revenueDistribution,
      feedbackSummary,
    });
  } catch (error) {
    console.error("Error fetching event analytics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const generateQrCode = async (req, res) => {
  try {
    const { eventId, tickets, attendeeEmail, totalAmount } = req.body;

    // Validate required fields
    if (!eventId || !tickets || !attendeeEmail || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Amount in cents
      currency: "usd",
      metadata: { eventId, attendeeEmail },
    });

    // Generate a Payment Link or QR Code URL
    const paymentLink = `https://checkout.stripe.com/pay/${paymentIntent.client_secret}`;

    res.status(200).json({ paymentLink });
  } catch (err) {
    console.error("Error generating payment link:", err);
    res.status(500).json({ message: "Failed to generate payment link" });
  }
};

// Apply discount to event tickets
export const applyDiscount = async (req, res) => {
  const { eventId, discountPercentage } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const discountAmount = (event.amount * discountPercentage) / 100;
    // add upto three decimalm places
    event.amount = (event.amount - discountAmount).toFixed(3);

    await event.save();

    res.status(200).json({ message: "Discount applied successfully", event });
  } catch (error) {
    console.error("Error applying discount:", error);
    res.status(500).json({ message: "Failed to apply discount" });
  }
};
