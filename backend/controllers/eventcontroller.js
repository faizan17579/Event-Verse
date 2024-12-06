import Event from "../models/Event.js";
import User from "../models/User.js";
import Stripe from "stripe";
import PDFDocument from "pdfkit";


const stripe = new Stripe("sk_test_51QS0yZJDUj9ArTtKD6jx9SHeZFMGmcETkZF9Bag1pvU8yG1KtBpus7fPE75VwavXVwoeuWfl4SwHBSzI7CHQk0Rw00z4tWPCLM");

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
      return res.status(404).json({ message: "No booking found for the provided email." });
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
    console.log(paymentIntent);

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      eventId,
      tickets,
      attendeeEmail,
      totalAmount,
    });
  } catch (error) {
    console.error("Error booking tickets:", error); // Add more logs for better visibility
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
// Create a new event (Organizer only)
export const createEvent = async (req, res) => {
  const { name, date, location, type, availableTickets, amount, organizerid } = req.body;

  try {
    const organizer = await User.findOne({ _id: organizerid, role: "Organizer" });

    if (!organizer) {
      return res.status(403).json({ message: "Unauthorized: Only organizers can create events" });
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
      return res.status(403).json({ message: "Unauthorized: Only organizers can view this data" });
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
    const events = await Event.find({isApproved: true});
   
   
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
      return res.status(403).json({ message: "You are not authorized to end this event." });
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
      return res.status(403).json({ message: "You are not authorized to edit this event." });
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
      (sum, event) => sum + event.amount * (event.attendees.length || 0),
      0
    );
    const totalTicketsSold = events.reduce(
      (sum, event) => sum + (event.attendees.length || 0),
      0
    );
    const totalEvents = events.length;

    // Format data for the response
    const formattedData = events.map((event) => ({
      eventName: event.name,
      ticketsSold: event.attendees.length,
      revenue: event.amount * event.attendees.length,
      date: event.date,
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
