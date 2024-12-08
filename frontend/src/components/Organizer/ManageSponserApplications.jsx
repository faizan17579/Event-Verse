import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

const ManageSponsorApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await fetch(`http://localhost:5000/api/sponsor/organizer/${user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }

        const data = await response.json();
        setApplications(data);
      } catch (err) {
        setError("Failed to load applications. Please try again later.");
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleStatusChange = async (applicationId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/sponsor/application/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update application status");
      }

      const updatedApplication = await response.json();
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: updatedApplication.status } : app
        )
      );
    } catch (err) {
      console.error("Error updating application status:", err);
      alert("Failed to update application status. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="loader border-t-4 border-b-4 border-yellow-400 h-12 w-12 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-white"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(242, 98, 152, 0.3), rgba(242, 98, 152, 0.7)), url('/images/login_bc.png')`,
        backgroundSize: "cover",
      }}
    >
      {error && (
        <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <header className="text-center py-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 animate-bounce">
          Manage <span className="text-yellow-400">Sponsor Applications</span>
        </h1>
        <p className="text-xl max-w-3xl mx-auto text-gray-100">
          View and manage sponsorship applications for your events.
        </p>
      </header>

      <div className="container mx-auto px-6 py-10">
        {applications.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-800 text-2xl font-bold">
              No applications found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-gray-900 text-white p-6 rounded-lg shadow-xl transform transition-transform duration-300 hover:scale-105"
              >
                <h3 className="text-center text-2xl font-bold mb-2 text-yellow-400 uppercase">
                  {application.eventId.name}
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Company Name:</strong> {application.companyName}
                  </p>
                  <p>
                    <strong>Contact Number:</strong> {application.contactNumber}
                  </p>
                  <p>
                    <strong>Amount Sponsored:</strong> ${application.amountSponsored}
                  </p>
                  <p className="flex items-center">
                    <strong>Status:</strong>
                    {application.status === "approved" ? (
                      <FaCheck className="ml-2 text-green-500" />
                    ) : application.status === "rejected" ? (
                      <FaTimes className="ml-2 text-red-500" />
                    ) : (
                      <span className="ml-2 text-yellow-500">Pending</span>
                    )}
                  </p>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleStatusChange(application._id, "approved")}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(application._id, "rejected")}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSponsorApplications;