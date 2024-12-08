// Minor changes to Dashboard UI

import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

const AttendeeDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode the JWT payload
        const payload = JSON.parse(atob(token.split(".")[1])); // Decoding the payload

        // Extract the user object from the decoded payload
        const userData = payload.us;

        // Set the user object in the state
        setUser(userData);
        // Full user object
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);
  return (
    <div
      className="min-h-screen flex flex-col text-white"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(242, 98, 152, 0.3), rgba(242, 98, 152, 0.7)), url('/images/login_bc.png')`,
        backgroundSize: "cover",
      }}
    >
      {/* Navbar */}
      <nav className="bg-gray-800 text-white shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center p-5">
          <h1 className="text-3xl font-bold text-white">
            <NavLink to="/">EventVerse</NavLink>
          </h1>
          <div className="hidden md:flex gap-6 text-lg">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 border-b-2 border-yellow-400 pb-1"
                  : "hover:text-yellow-400 transition duration-300 text-white"
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/attendee/events"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 border-b-2 border-yellow-400 pb-1"
                  : "hover:text-yellow-400 transition duration-300 text-white"
              }
            >
              My Events
            </NavLink>

            <NavLink
              to="/preferences"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 border-b-2 border-yellow-400 pb-1"
                  : "hover:text-yellow-400 transition duration-300 text-white"
              }
            >
              View Preferences
            </NavLink>

            <NavLink
              to="/"
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
                to="/attendee/events"
                className={({ isActive }) =>
                  isActive
                    ? "block py-3 px-5 text-yellow-400 bg-gray-800"
                    : "block py-3 px-5 hover:bg-gray-600"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                My Events
              </NavLink>
            </li>

            <li className="border-b border-gray-600">
              <NavLink
                to="/preferences"
                className={({ isActive }) =>
                  isActive
                    ? "block py-3 px-5 text-yellow-400 bg-gray-800"
                    : "block py-3 px-5 hover:bg-gray-600"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                View Preferences
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/"
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
      <header className="text-center py-20">
        <h2 className="text-5xl font-extrabold mb-6 animate-pulse">
          Welcome {user?.name || "Guest"}
        </h2>
        <p className="text-lg max-w-2xl mx-auto">
          Explore events, book tickets, and track your favorite experiences in
          one place.
        </p>
      </header>

      {/* Main Dashboard */}
      <section className="px-5 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Explore Events */}
          <div className="bg-gray-100 text-black p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-4">Explore Events</h3>
            <p>
              Discover events that match your interests. Filter by date, type,
              and location.
            </p>
            <Link
              to="/browse-events"
              className="block mt-4 text-center bg-purple-600 text-white py-2 rounded-full hover:bg-purple-700 transition"
            >
              Browse Events
            </Link>
          </div>

          {/* Card 2: My Tickets */}
          <div className="bg-gray-100 text-black p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-4">My Tickets</h3>
            <p>
              Access your purchased tickets and get ready for your upcoming
              events.
            </p>
            <Link
              to="/my-tickets"
              className="block mt-4 text-center bg-purple-600 text-white py-2 rounded-full hover:bg-purple-700 transition"
            >
              View Tickets
            </Link>
          </div>

          {/* Card 3: Feedback */}
          <div className="bg-gray-100 text-black p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-4">Provide Feedback</h3>
            <p>
              Share your experience and takings and help us improve future
              events.
            </p>
            <Link
              to="/feedback"
              className="block mt-4 text-center bg-purple-600 text-white py-2 rounded-full hover:bg-purple-700 transition"
            >
              Give Feedback
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 text-center mt-auto">
        <p>© 2024 EventVerse. All rights reserved.</p>
        <div className="flex justify-center gap-5 mt-4">
          <a href="#" className="hover:text-yellow-400">
            Facebook
          </a>
          <a href="#" className="hover:text-yellow-400">
            Twitter
          </a>
          <a href="#" className="hover:text-yellow-400">
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
};

export default AttendeeDashboard;
