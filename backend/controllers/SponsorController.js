import SponserAppli from "../models/SponserAppli.js";
import Event from "../models/Event.js";

// Submit a sponsorship application
export const submitApplication = async (req, res) => {
  const { userId, companyName, contactNumber, eventId, amountSponsored } = req.body;

  try {
    const newApplication = new SponserAppli({
      userId,
      companyName,
      contactNumber,
      eventId,
      amountSponsored,
    });

    const savedApplication = await newApplication.save();

    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(500).json({ message: "Failed to submit application", error });
  }
};

// View sponsorship applications for a specific user
export const viewApplication = async (req, res) => {
  const { userId } = req.params;

  try {
    const applications = await SponserAppli.find({ userId }).populate({
      path: "eventId",
      model: Event,
      select: "name date location type createdBy organizerName isEnded isApproved"
    });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications", error });
  }
};

// View sponsorship applications for events created by a specific organizer
export const viewApplicationsByOrganizer = async (req, res) => {
  const { organizerId } = req.params;

  try {
    // Find all events created by the organizer
    const events = await Event.find({ createdBy: organizerId });

    // Extract event IDs
    const eventIds = events.map(event => event._id);

    // Find all sponsorship applications for these events
    const applications = await SponserAppli.find({ eventId: { $in: eventIds } }).populate({
      path: "eventId",
      model: Event,
      select: "name date location type createdBy organizerName isEnded isApproved"
    });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications", error });
  }
};

// Change the status of a sponsorship application
export const changeApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  if (!["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const application = await SponserAppli.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    const updatedApplication = await application.save();

    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: "Failed to change application status", error });
  }
};