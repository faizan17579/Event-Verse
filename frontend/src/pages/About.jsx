import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const About = () => {
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
        {" "}
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-extrabold mb-6 animate-bounce">
            About <span className="text-yellow-400">EventVerse</span>
          </h2>
          <p className="text-lg sm:text-xl mb-8">
            EventVerse is an innovative platform revolutionizing the way events
            are planned, organized, and experienced. Learn more about our
            mission, vision, and the team behind this exceptional project.
          </p>
        </div>
      </header>

      {/* Meet the Team Section */}
      <section className="py-16 bg-gradient-to-b from-gray-800 to-gray-700 text-white w-full">
        <div className="w-full px-6">
          <h3 className="text-4xl font-bold text-center mb-10">
            Meet the Team
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition transform duration-300 text-center">
              <img
                src="../images/abdullah.png"
                alt="Team Member"
                className="rounded-full w-32 h-32 mx-auto mb-4"
              />
              <h4 className="text-2xl font-bold">Abdullah Daoud</h4>
              <p className="text-yellow-300">Lead Developer</p>
              <p className="mt-2">
                Responsible for crafting seamless attendee experiences and
                ensuring robust backend APIs.
              </p>
            </div>
            {/* Team Member 2 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition transform duration-300 text-center">
              <img
                src="../images/rounded 1.jpeg"
                alt="Team Member"
                className="rounded-full w-32 h-32 mx-auto mb-4"
              />
              <h4 className="text-2xl font-bold">Usman Ali</h4>
              <p className="text-yellow-300">Organizer Specialist</p>
              <p className="mt-2">
                Expert in building organizer modules, ticket management, and
                event analytics tools.
              </p>
            </div>
            {/* Team Member 3 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition transform duration-300 text-center">
              <img
                src="../images/faizan.png"
                alt="Team Member"
                className="rounded-full w-32 h-32 mx-auto mb-4"
              />
              <h4 className="text-2xl font-bold">Faizan Rasheed</h4>
              <p className="text-yellow-300">Admin & Vendor Expert</p>
              <p className="mt-2">
                Focuses on creating vendor management systems and ensuring
                smooth interactions between admins and vendors.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 text-center">
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

export default About;
