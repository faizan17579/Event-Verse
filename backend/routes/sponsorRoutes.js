import express from "express";
import { submitApplication, viewApplication, viewApplicationsByOrganizer, changeApplicationStatus } from "../controllers/SponsorController.js";

const router = express.Router();

// Route to submit a sponsorship application
router.post("/submit", submitApplication);

// Route to view sponsorship applications for a specific user
router.get("/user/:userId", viewApplication);

// Route to view sponsorship applications for events created by a specific organizer
router.get("/organizer/:organizerId", viewApplicationsByOrganizer);

// Route to change the status of a sponsorship application
router.patch("/application/:applicationId", changeApplicationStatus);

export default router;