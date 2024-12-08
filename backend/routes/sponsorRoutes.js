// Import necessary modules and models
import express from "express";
import {
  getVendorDetails,
  getSponsoredEvents,
  approveSponsorship,
  rejectSponsorship,
} from "../controllers/SponsorController.js";

const router = express.Router();

// Route to get vendor details
router.get("/vendors/:vendorId", getVendorDetails);

// Route to get sponsored events
router.get("/vendors/:vendorId/events", getSponsoredEvents);

// Route to approve sponsorship
router.put(
  "/vendors/:vendorId/sponsorships/:sponsorshipId/approve",
  approveSponsorship
);

// Route to reject sponsorship
router.put(
  "/vendors/:vendorId/sponsorships/:sponsorshipId/reject",
  rejectSponsorship
);

export default router;
