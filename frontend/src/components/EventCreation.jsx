import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const EventCreation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user data
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
    type: "",
    availableTickets: 0,
    amount: 0, // Add amount field
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure the logged-in user is available
      if (!user) {
        alert("User not logged in. Please log in again.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, organizerid: user.id }), // Pass user._id as organizerId
      });

      const data = await response.json();
      if (response.ok) {
        alert("Event created successfully!");
        setFormData({
          name: "",
          date: "",
          location: "",
          type: "",
          availableTickets: 0,
          amount: 0,
        }); // Reset the form
      } else {
        alert(data.message || "Failed to create event.");
      }
    } catch (err) {
      console.error("Error creating event:", err);
      alert("An error occurred while creating the event.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col text-white"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(242, 98, 152, 0.3), rgba(242, 98, 152, 0.7)), url('/images/login_bc.png')`,
        backgroundSize: "cover",
      }}
    >
      <nav className="bg-gray-800 text-white shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center p-5">
          <h1 className="text-3xl font-bold text-white">
            <NavLink to="/">EventVerse</NavLink>
          </h1>
          <div className="hidden md:flex gap-6 text-lg">
            <NavLink
              to="/dashboard/organizer"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 border-b-2 border-yellow-400 pb-1"
                  : "hover:text-yellow-400 transition duration-300 text-white"
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/organizer/create-event"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 border-b-2 border-yellow-400 pb-1"
                  : "hover:text-yellow-400 transition duration-300 text-white"
              }
            >
              Create Event
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 border-b-2 border-yellow-400 pb-1"
                  : "hover:text-yellow-400 transition duration-300 text-white"
              }
            >
              Profile
            </NavLink>
            <NavLink
              to="/logout"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 border-b-2 border-yellow-400 pb-1"
                  : "hover:text-yellow-400 transition duration-300 text-white"
              }
            >
              Logout
            </NavLink>
          </div>
          {/* Hamburger Menu */}
          <button
            className="block md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
        {/* Dropdown Menu for Mobile */}
        {isMenuOpen && (
          <ul className="md:hidden bg-gray-700 text-white text-lg">
            <li className="border-b border-gray-600">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "block py-3 px-5 text-yellow-400 bg-gray-800"
                    : "block py-3 px-5 hover:bg-gray-600"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </NavLink>
            </li>
            <li className="border-b border-gray-600">
              <NavLink
                to="/create-event"
                className={({ isActive }) =>
                  isActive
                    ? "block py-3 px-5 text-yellow-400 bg-gray-800"
                    : "block py-3 px-5 hover:bg-gray-600"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Create Event
              </NavLink>
            </li>
            <li className="border-b border-gray-600">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? "block py-3 px-5 text-yellow-400 bg-gray-800"
                    : "block py-3 px-5 hover:bg-gray-600"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/logout"
                className={({ isActive }) =>
                  isActive
                    ? "block py-3 px-5 text-yellow-400 bg-gray-800"
                    : "block py-3 px-5 hover:bg-gray-600"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Logout
              </NavLink>
            </li>
          </ul>
        )}
      </nav>
      {/* Header */}
      <header className="text-center py-10">
        <h1 className="text-4xl font-extrabold mb-4 animate-bounce">
          Create Event
        </h1>
        <p className="text-lg max-w-2xl mx-auto">
          Organize your next big event by filling out the details below!
        </p>
      </header>

      {/* Form Section */}
      <section className="container mx-auto px-6 py-10">
        <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            {/* Event Name */}
            <div className="mb-6">
              <label htmlFor="name" className="block text-lg font-medium mb-2">
                Event Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter event name"
                required
              />
            </div>

            {/* Event Date */}
            <div className="mb-6">
              <label htmlFor="date" className="block text-lg font-medium mb-2">
                Event Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>

            {/* Event Location */}
            <div className="mb-6">
              <label
                htmlFor="location"
                className="block text-lg font-medium mb-2"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter event location"
                required
              />
            </div>

            {/* Event Type */}
            <div className="mb-6">
              <label htmlFor="type" className="block text-lg font-medium mb-2">
                Event Type
              </label>
              <input
                type="text"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter event type (e.g., Conference)"
                required
              />
            </div>

            {/* Tickets and Amount */}
            <div className="md:flex md:gap-6 py-5">
              {/* Available Tickets */}
              <div className="mb-6 md:mb-0 md:flex-1">
                <label
                  htmlFor="availableTickets"
                  className="block text-lg font-medium mb-2"
                >
                  Available Tickets
                </label>
                <input
                  type="number"
                  id="availableTickets"
                  name="availableTickets"
                  value={formData.availableTickets}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter number of tickets"
                  required
                />
              </div>

              {/* Ticket Price */}
              <div className="md:flex-1">
                <label
                  htmlFor="amount"
                  className="block text-lg font-medium mb-2"
                >
                  Ticket Price (in $)
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter ticket price"
                  required
                  min="0"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3  rounded-full hover:bg-purple-700 transition duration-300 font-bold"
            >
              Create Event
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default EventCreation;
