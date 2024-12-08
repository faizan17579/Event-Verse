import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { event, sponsorshipDetails } = location.state || {};

  if (!event || !sponsorshipDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">No Sponsorship Details Found</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(242, 98, 152, 0.3), rgba(242, 98, 152, 0.7)), url('/images/login_bc.png')`,
        backgroundSize: "cover",
      }}
    >
      <div className="bg-gray-900 p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-4">Sponsorship Submitted</h1>
        <p className="text-xl mb-4">Thank you for your sponsorship!</p>
        <div className="text-left">
          <p><strong>Event:</strong> {event.name}</p>
          <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Type:</strong> {event.type}</p>
          <p><strong>Company Name:</strong> {sponsorshipDetails.companyName}</p>
          <p><strong>Contact Number:</strong> {sponsorshipDetails.contactNumber}</p>
          <p><strong>Amount Sponsored:</strong> ${sponsorshipDetails.amount}</p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Confirmation;