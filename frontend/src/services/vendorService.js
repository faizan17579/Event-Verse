// vendorService.js

const API_BASE_URL = "http://localhost:5000/api/sponsor";

// Helper function for handling fetch responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "An error occurred while fetching data");
  }
  return response.json();
};

// Fetch vendor details
export const getVendorDetails = async (vendorId) => {
  try {
    console.log("didjd", vendorId);
    const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}`);
    return await handleResponse(response);
  } catch (error) {
    throw new Error("Error fetching vendor details: " + error.message);
  }
};

// Fetch sponsored events for the vendor
export const getVendorSponsoredEvents = async (vendorId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/events`);
    return await handleResponse(response);
  } catch (error) {
    throw new Error(
      "Error fetching vendor's sponsored events: " + error.message
    );
  }
};

// Approve a sponsorship for an event
export const approveSponsorship = async (vendorId, sponsorshipId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/vendors/${vendorId}/sponsorships/${sponsorshipId}/approve`,
      {
        method: "PUT", // Change to PUT for updating resource
        headers: { "Content-Type": "application/json" },
      }
    );
    return await handleResponse(response);
  } catch (error) {
    throw new Error("Error approving sponsorship: " + error.message);
  }
};

// Reject a sponsorship for an event
export const rejectSponsorship = async (vendorId, sponsorshipId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/vendors/${vendorId}/sponsorships/${sponsorshipId}/reject`,
      {
        method: "PUT", // Change to PUT for updating resource
        headers: { "Content-Type": "application/json" },
      }
    );
    return await handleResponse(response);
  } catch (error) {
    throw new Error("Error rejecting sponsorship: " + error.message);
  }
};
