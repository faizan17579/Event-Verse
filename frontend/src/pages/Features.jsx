import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const FeaturesPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center p-5">
          <h1 className="text-3xl font-bold text-white">
            <NavLink to="/">EventVerse</NavLink>
          </h1>
          <div className="hidden md:flex gap-6 text-lg">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 border-b-2 border-yellow-400 pb-1"
                  : "hover:text-yellow-400 transition duration-300 text-white"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/features"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 border-b-2 border-yellow-400 pb-1"
                  : "hover:text-yellow-400 transition duration-300 text-white"
              }
            >
              Features
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 border-b-2 border-yellow-400 pb-1"
                  : "hover:text-yellow-400 transition duration-300 text-white"
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 border-b-2 border-yellow-400 pb-1"
                  : "hover:text-yellow-400 transition duration-300 text-white"
              }
            >
              Contact
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
        {isMenuOpen && (
          <ul className="md:hidden bg-gray-700 text-white text-lg">
            <li className="border-b border-gray-600">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "block py-3 px-5 text-yellow-400 bg-gray-800"
                    : "block py-3 px-5 hover:bg-gray-600"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li className="border-b border-gray-600">
              <NavLink
                to="/features"
                className={({ isActive }) =>
                  isActive
                    ? "block py-3 px-5 text-yellow-400 bg-gray-800"
                    : "block py-3 px-5 hover:bg-gray-600"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </NavLink>
            </li>
            <li className="border-b border-gray-600">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive
                    ? "block py-3 px-5 text-yellow-400 bg-gray-800"
                    : "block py-3 px-5 hover:bg-gray-600"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive
                    ? "block py-3 px-5 text-yellow-400 bg-gray-800"
                    : "block py-3 px-5 hover:bg-gray-600"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </NavLink>
            </li>
          </ul>
        )}
      </nav>
      {/* Header */}
      <header
        className="relative text-center py-40 bg-cover bg-center flex-grow"
        style={{
          backgroundImage: `linear-gradient(rgba(242, 98, 152, 0.2), rgba(242, 98, 152, 0.2)), url('./images/bc.png')`,
          backgroundSize: "cover",
        }}
      >
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 animate-bounce">
            Explore Our <span className="text-yellow-400">Features</span>
          </h2>
          <p className="text-lg sm:text-xl mb-8">
            Discover how EventVerse empowers attendees, organizers, and vendors
            to create seamless event experiences. From planning to execution,
            we’ve got you covered.
          </p>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-10 bg-gradient-to-b from-gray-800 to-gray-700 text-white  shadow-xl">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
          {[
            {
              title: "Attendee Module",
              points: [
                "Secure user registration and login.",
                "Search and book events with filters.",
                "Download e-tickets with QR-code-based check-in.",
                "Provide feedback and view past interactions.",
              ],
            },
            {
              title: "Organizer Module",
              points: [
                "Create and manage events seamlessly.",
                "Set ticket types, pricing, and availability.",
                "Track attendee details and respond to queries.",
                "Access real-time analytics and feedback.",
              ],
            },
            {
              title: "Admin Module",
              points: [
                "Approve events and manage users.",
                "Generate reports on event metrics and user activity.",
                "Handle complaints and feedback moderation.",
                "Monitor overall platform growth and analytics.",
              ],
            },
            {
              title: "Vendor Module",
              points: [
                "Secure vendor registration and profile setup.",
                "Bid for event contracts with transparency.",
                "Track payment statuses for services.",
                "Engage in sponsorships effectively.",
              ],
            },
            {
              title: "Payment Integration",
              points: [
                "Secure and seamless ticket purchases.",
                "Support for multiple payment gateways (Stripe, PayPal).",
                "Transparent tracking of all transactions.",
              ],
            },
            {
              title: "Event Analytics",
              points: [
                "Detailed reports on attendee feedback.",
                "Real-time ticket sales tracking.",
                "Insights into attendee engagement.",
                "Data-driven recommendations for future events.",
              ],
            },
          ].map(({ title, points }) => (
            <div
              key={title}
              className="bg-gray-600 border border-gray-500 p-6 rounded-lg shadow-md hover:scale-105 hover:shadow-lg hover:bg-gray-500 transition-transform duration-300"
            >
              <h3 className="text-xl font-bold mb-4 text-yellow-300">
                {title}
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-200">
                {points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 text-center">
        <p>© 2024 EventVerse. All rights reserved.</p>
        <div className="flex justify-center gap-5 mt-4">
          {["Facebook", "Twitter", "LinkedIn"].map((platform) => (
            <a
              key={platform}
              href="#"
              className="hover:text-yellow-400 transition duration-300"
            >
              {platform}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default FeaturesPage;
