import express from "express";
import {
  downloadTicket,
  searchEvents,
  bookTickets,
  createEvent,
  getOrganizerEvents,
  getRegisteredEvents,
  getAllEvents,
  endEvent,
  editEvent,
  approveEvent,
  disapproveEvent,
  geteventforadmin,
  geteventfororg,
  getTicketSales
} from "../controllers/eventcontroller.js";

const router = express.Router();

// Route: Download E-Ticket
router.post("/download-ticket", downloadTicket);

// Route: Search Events with filters (optional)
router.get("/search", searchEvents);

// Route: Book tickets for an event
router.post("/book", bookTickets);

// Route: Create a new event (Organizer only)
router.post("/create", createEvent);

// Route: Fetch all events created by the organizer
router.get("/organizer/:email", getOrganizerEvents);

// Route: Fetch registered events for an attendee
router.get("/registered-events/:email", getRegisteredEvents);

// Route: Fetch all events
router.get("/all-events", getAllEvents);

// Route: End an event
router.put("/end-event/:id", endEvent);

// Route: Edit event by specific organizer who created it
router.put("/edit-event/:id", editEvent);

// Route to approve an event
router.post("/approve-event/:id", approveEvent);

// Route to disapprove an event
router.post("/disapprove-event/:id", disapproveEvent);

router.get("/admin/events", geteventforadmin);

router.get("/org/events", geteventfororg);

router.get("/ticket-sales", getTicketSales);

export default router;
