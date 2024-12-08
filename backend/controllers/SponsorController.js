import Feedback from "../models/Feedback.js";
import User from "../models/User.js";
import Event from "../models/Event.js";
import Ticket from "../models/Ticket.js ";
import Vendor from "../models/Vendor.js";
export const getVendorDetails = async (req, res) => {
  const { vendorId } = req.params;
  console.log("usan", vendorId);

  try {
    const vendor = await Vendor.findById(vendorId).populate(
      "sponsorships.eventId",
      "name date location type"
    );

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    res.status(200).json({ vendor });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching vendor details.",
      error: error.message,
    });
  }
};

// Get all events sponsored by the vendor
export const getSponsoredEvents = async (req, res) => {
  const { vendorId } = req.params;

  try {
    const vendor = await Vendor.findById(vendorId).populate(
      "sponsorships.eventId",
      "name date location type amount"
    );

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    const sponsoredEvents = vendor.sponsorships.map((s) => ({
      eventId: s.eventId._id,
      name: s.eventId.name,
      date: s.eventId.date,
      location: s.eventId.location,
      type: s.eventId.type,
      amountSponsored: s.amountSponsored,
      status: s.status,
    }));

    res.status(200).json({ sponsoredEvents });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching sponsored events.",
      error: error.message,
    });
  }
};

// Approve sponsorship for an event
export const approveSponsorship = async (req, res) => {
  const { vendorId, sponsorshipId } = req.params;

  try {
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    const sponsorship = vendor.sponsorships.id(sponsorshipId);

    if (!sponsorship) {
      return res.status(404).json({ message: "Sponsorship not found." });
    }

    sponsorship.status = "Approved";
    await vendor.save();

    // Optionally, update the Event schema with the sponsorship details
    await Event.findByIdAndUpdate(sponsorship.eventId, {
      $push: {
        sponsors: { vendorId, amountSponsored: sponsorship.amountSponsored },
      },
    });

    res.status(200).json({ message: "Sponsorship approved successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error approving sponsorship.", error: error.message });
  }
};

// Reject sponsorship for an event
export const rejectSponsorship = async (req, res) => {
  const { vendorId, sponsorshipId } = req.params;

  try {
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    const sponsorship = vendor.sponsorships.id(sponsorshipId);

    if (!sponsorship) {
      return res.status(404).json({ message: "Sponsorship not found." });
    }

    sponsorship.status = "Rejected";
    await vendor.save();

    res.status(200).json({ message: "Sponsorship rejected successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error rejecting sponsorship.", error: error.message });
  }
};
