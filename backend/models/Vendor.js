import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  sponsorships: [
    {
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
      amountSponsored: { type: Number, required: true }, // Sponsorship amount
      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;
