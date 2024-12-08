// vendorService.js

const API_BASE_URL = "http://localhost:5000/api/sponsor";

// Function to submit a sponsorship application
export const submitApplication = async (applicationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(applicationData),
    });

    if (!response.ok) {
      throw new Error("Failed to submit application");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error submitting application:", error);
    throw error;
  }
};

// Function to view sponsorship applications for a specific user
export const viewApplications = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch applications");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error;
  }
};