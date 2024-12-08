import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaMusic, FaCheck, FaTimes } from "react-icons/fa";

const ViewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await fetch(`http://localhost:5000/api/sponsor/user/${user.id}`, {
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
        backgroundImage: `linear-gradient(to right, rgba(242, 98, 152, 0.3), rgba(242, 98, 152, 0.7)), url('./images/login_bc.png')`,
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
          My <span className="text-yellow-400">Applications</span>
        </h1>
        <p className="text-xl max-w-3xl mx-auto text-gray-100">
          View the status of your sponsorship applications.
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
                  <p className="flex items-center">
                    <FaCalendarAlt className="mr-2 h-4 w-4" />
                    {new Date(application.eventId.date).toLocaleDateString()}
                  </p>
                  <p className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 h-4 w-4" />
                    {application.eventId.location}
                  </p>
                  <p className="flex items-center">
                    <FaMusic className="mr-2 h-4 w-4" />
                    {application.eventId.type}
                  </p>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewApplications;