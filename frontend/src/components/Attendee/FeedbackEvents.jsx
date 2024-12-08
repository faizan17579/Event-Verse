// Giving Feedback for Events, changing feedbacks and applying filters

import React, { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDollarSign,
  FaGlobe,
  FaMusic,
} from "react-icons/fa";

const FeedbackEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ date: "", location: "", type: "" });
  const [feedback, setFeedback] = useState({});
  const [error, setError] = useState("");

  const imageList = [
    "/images/events/classicalSerenade.png",
    "/images/events/countryLegends.png",
    "/images/events/Marathon.png",
    "/images/events/RockFestival.png",
    "/images/events/ElectricSymphony.png",
    "/images/events/MelodyMania.png",
    "/images/events/MetroPolisMarathon.png",
    "/images/events/musicalFusion.png",
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/events/all-events"
      );
      if (!response.ok) throw new Error("Failed to fetch events");

      const data = await response.json();
      const activeEvents = data
        .filter((event) => !event.isEnded)
        .map((event) => ({
          ...event,
          image: imageList[Math.floor(Math.random() * imageList.length)],
        }));

      setEvents(activeEvents);
      setFilteredEvents(activeEvents);
    } catch (err) {
      setError("Failed to load events. Please try again later.");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const filtered = events.filter((event) => {
      const matchesDate =
        !filters.date ||
        new Date(event.date).toLocaleDateString() ===
          new Date(filters.date).toLocaleDateString();
      const matchesLocation =
        !filters.location ||
        event.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesType =
        !filters.type ||
        event.type.toLowerCase().includes(filters.type.toLowerCase());
      return matchesDate && matchesLocation && matchesType;
    });
    setFilteredEvents(filtered);
  };

  const resetFilters = () => {
    setFilters({ date: "", location: "", type: "" }); // Clear all filters
    setFilteredEvents(events); // Reset filtered events to original list
  };

  const handleFeedbackChange = (eventId, field, value) => {
    setFeedback((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [field]: value,
      },
    }));
  };

  const handleSubmitFeedback = async (eventId) => {
    const eventFeedback = feedback[eventId];
    if (!eventFeedback || !eventFeedback.rating || !eventFeedback.comment) {
      alert("Please provide a rating and comment.");
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await fetch("http://localhost:5000/api/feedback/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          userId: user.id, // Replace with actual logged-in user ID
          rating: eventFeedback.rating,
          comment: eventFeedback.comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred while submitting your feedback.");
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
          Event <span className="text-yellow-400">Feedback</span>
        </h1>
        <p className="text-xl max-w-3xl mx-auto text-gray-100">
          Provide ratings and comments for the events you attended.
        </p>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-3 text-indigo-300" />
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-3 text-indigo-300" />
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Filter by Location"
              className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="relative">
            <FaGlobe className="absolute left-3 top-3 text-indigo-300" />
            <input
              type="text"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              placeholder="Filter by Type"
              className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-6">
          <button
            onClick={applyFilters}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-8 rounded-full transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-8 rounded-full transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-gray-900 text-white p-6 rounded-lg shadow-xl transform transition-transform duration-300 hover:scale-105"
            >
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <div className="p-6">
                <h3 className="text-center text-2xl font-bold mb-2 text-yellow-400 uppercase">
                  {event.name}
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p className="flex items-center">
                    <FaCalendarAlt className="mr-2 h-4 w-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 h-4 w-4" />
                    {event.location}
                  </p>
                  <p className="flex items-center">
                    <FaMusic className="mr-2 h-4 w-4" />
                    {event.type}
                  </p>
                  <p className="flex items-center">
                    <FaDollarSign className="mr-2 h-4 w-4" />${event.amount}
                  </p>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-bold mb-2">
                    Rate this event (1 to 5):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={feedback[event._id]?.rating || ""}
                    onChange={(e) =>
                      handleFeedbackChange(event._id, "rating", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <label className="block text-sm font-bold mt-4 mb-2">
                    Add your comment:
                  </label>
                  <textarea
                    rows="3"
                    value={feedback[event._id]?.comment || ""}
                    onChange={(e) =>
                      handleFeedbackChange(event._id, "comment", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write your feedback here..."
                  ></textarea>
                  <button
                    onClick={() => handleSubmitFeedback(event._id)}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackEvents;
