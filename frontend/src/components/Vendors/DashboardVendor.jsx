// VendorDashboard.js
import React, { useEffect, useState } from "react";
import {
  getVendorDetails,
  getVendorSponsoredEvents,
  approveSponsorship,
  rejectSponsorship,
} from "../../services/vendorService";

const VendorDashboard = ({}) => {
  //get user from local storage
  const user = JSON.parse(localStorage.getItem("user"));

  const [vendorId] = useState(user.id); // Assuming vendorId is stored in user object
  const [vendor, setVendor] = useState({});
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setLoading(true);
        console.log(vendorId);
        const vendorDetails = await getVendorDetails(vendorId);
        const sponsoredEvents = await getVendorSponsoredEvents(vendorId);

        setVendor(vendorDetails);
        setEvents(sponsoredEvents);
      } catch (err) {
        setError("Failed to load vendor data");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [vendorId]);

  const handleApprove = async (sponsorshipId) => {
    try {
      await approveSponsorship(vendorId, sponsorshipId);
      alert("Sponsorship approved!");
      const updatedEvents = events.map((event) =>
        event.sponsorshipId === sponsorshipId
          ? { ...event, status: "Approved" }
          : event
      );
      setEvents(updatedEvents);
    } catch (err) {
      alert("Failed to approve sponsorship.");
    }
  };

  const handleReject = async (sponsorshipId) => {
    try {
      await rejectSponsorship(vendorId, sponsorshipId);
      alert("Sponsorship rejected!");
      const updatedEvents = events.map((event) =>
        event.sponsorshipId === sponsorshipId
          ? { ...event, status: "Rejected" }
          : event
      );
      setEvents(updatedEvents);
    } catch (err) {
      alert("Failed to reject sponsorship.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-signup-bg bg-cover bg-center text-white">
      <header className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4 shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">Vendor Dashboard</div>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="hover:text-yellow-400">
                Dashboard (Home)
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-400">
                Events Management
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-400">
                Profile Settings
              </a>
            </li>
            <li>
              <button className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-700">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Welcome, {vendor.name}!</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Ongoing Events</h2>
            <p>{events.filter((event) => event.status === "Ongoing").length}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Upcoming Events</h2>
            <p>
              {events.filter((event) => event.status === "Upcoming").length}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Revenue Summary</h2>
            <p>
              $
              {events
                .reduce((sum, event) => sum + event.amountSponsored / 100, 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Feedback Summary</h2>
            <p>{/* Display a snippet of reviews here */}</p>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-4">Events Management</h3>
        <table className="w-full bg-gray-700 text-white rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-600">
              <th className="p-2">Event Name</th>
              <th className="p-2">Status</th>
              <th className="p-2">Attendee Count</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.eventId} className="border-b border-gray-500">
                <td className="p-2">{event.name}</td>
                <td className="p-2">{event.status}</td>
                <td className="p-2">{event.attendeeCount}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleApprove(event.sponsorshipId)}
                    className="bg-green-500 hover:bg-green-700 text-white px-2 py-1 rounded mr-2"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(event.sponsorshipId)}
                    className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <footer className="bg-gray-900 p-4 text-center">
        <ul className="flex justify-center space-x-4">
          <li>
            <a href="#" className="text-white hover:text-yellow-400">
              Help Center
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-yellow-400">
              Terms & Conditions
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-yellow-400">
              Contact Support
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default VendorDashboard;
