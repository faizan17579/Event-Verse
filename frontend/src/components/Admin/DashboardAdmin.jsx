import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaUsers,
  FaChartPie,
  FaClipboardList,
  FaComments,
} from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";
import { GiPriceTag } from "react-icons/gi";

const DashboardAdmin = () => {
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
      <header className="text-center py-16">
        <h2 className="text-5xl font-extrabold mb-6 animate-pulse">
          Welcome {user?.name || "Guest"}
        </h2>
        <p className="text-lg max-w-2xl mx-auto">
          Oversee platform activities, manage users and events, and review
          analytics.
        </p>
      </header>

      {/* Dashboard Section */}
      <section className="px-5 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Manage Users */}
          <div className="bg-gray-100 text-black p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
            <FaUsers className="text-4xl mb-4 text-blue-500" />
            <h3 className="text-2xl font-bold mb-4">Manage Users</h3>
            <p>
              Monitor user activities and handle account issues efficiently.
            </p>
            <Link
              to="/all-users"
              className="block mt-4 text-center bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition"
            >
              View Users
            </Link>
          </div>

          {/* Card 2: Manage Events */}
          <div className="bg-gray-100 text-black p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
            <MdEventAvailable className="text-4xl mb-4 text-green-500" />
            <h3 className="text-2xl font-bold mb-4">Manage Events</h3>
            <p>
              Approve or reject events, and ensure all listings meet quality
              standards.
            </p>
            <Link
              to="/admin/events"
              className="block mt-4 text-center bg-green-600 text-white py-2 rounded-full hover:bg-green-700 transition"
            >
              Manage Events
            </Link>
          </div>

          {/* Card 3: View Reports */}
          <div className="bg-gray-100 text-black p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
            <FaChartPie className="text-4xl mb-4 text-purple-500" />
            <h3 className="text-2xl font-bold mb-4">Reports</h3>
            <p>
              Access detailed reports and analytics to improve platform
              performance.
            </p>
            <Link
              to="/admin/reports"
              className="block mt-4 text-center bg-purple-600 text-white py-2 rounded-full hover:bg-purple-700 transition"
            >
              View Reports
            </Link>
          </div>

          {/* Card 4: Feedback */}
          <div className="bg-gray-100 text-black p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
            <FaComments className="text-4xl mb-4 text-yellow-500" />
            <h3 className="text-2xl font-bold mb-4">Feedback</h3>
            <p>Review user feedback to maintain high service quality.</p>
            <Link
              to="/all-feedback"
              className="block mt-4 text-center bg-yellow-600 text-white py-2 rounded-full hover:bg-yellow-700 transition"
            >
              Review Feedback
            </Link>
          </div>

          {/* Card 5: Give Discounts */}
          <div className="bg-gray-100 text-black p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
            <GiPriceTag className="text-4xl mb-4 text-red-500" />
            <h3 className="text-2xl font-bold mb-4">Give Discounts</h3>
            <p>Set overall discounts for all events on the platform.</p>
            <Link
              to="/admin/discounts"
              className="block mt-4 text-center bg-red-600 text-white py-2 rounded-full hover:bg-red-700 transition"
            >
              Set Discounts
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 text-center">
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

export default DashboardAdmin;