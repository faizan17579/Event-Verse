import React, { useState, useEffect } from "react";

import { Link, NavLink } from "react-router-dom";

import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { FiMail, FiPhone } from "react-icons/fi";
import { AiOutlineUser, AiOutlineTeam } from "react-icons/ai";

const Profile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // State to store user details
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState({}); // State for edited user details

  // Fetch user details from local storage when the component loads
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (storedUser && storedUser._id) {
          // Fetch user details from the API
          const response = await fetch(
            `http://localhost:5000/api/users/profile/${storedUser._id}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch user details");
          }

          const userData = await response.json();

          // Set the user and editable details
          setUser(userData.user);
          setEditedDetails(userData.user);
        } else {
          throw new Error("No valid user data found in local storage");
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    fetchUserDetails();
  }, []);

  // Handle input changes during editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle edit mode
  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  // Save updated user details back to local storage and state
  const handleSave = async () => {
    localStorage.setItem("user", JSON.stringify(editedDetails));
    const response = await fetch("http://localhost:5000/api/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedDetails),
    });
    const data = await response.json();
    if (response.ok) {
      alert(data.message);
    }
    setUser(editedDetails);
    setIsEditing(false); // Exit edit mode
  };

  // Cancel editing and revert to original details
  const handleCancel = () => {
    setEditedDetails(user); // Reset edited details to original state
    setIsEditing(false); // Exit edit mode
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl font-bold">No user data found!</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen  text-white"
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
        <h1 className="text-4xl font-extrabold mb-4">Your Profile</h1>
        <p className="text-lg">View and update your organizer information.</p>
      </header>

      {/* Profile Section */}
      <section className="max-w-4xl mx-auto bg-gray-100 text-black p-8 rounded-lg shadow-lg relative">
        <div className="flex justify-center relative mb-6">
          {/* Profile Picture */}
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-purple-600 shadow-lg">
            <img
              src="./images/profile.png"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-6">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                <AiOutlineUser className="inline-block mr-2" />
                Name
              </label>
              <input
                type="text"
                name="name"
                value={editedDetails.name}
                onChange={handleInputChange}
                placeholder="Not added yet"
                disabled={!isEditing}
                className={`w-full p-3 rounded-lg ${
                  isEditing
                    ? "border border-gray-300 bg-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                <FiMail className="inline-block mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={editedDetails.email}
                onChange={handleInputChange}
                placeholder="Not added yet"
                disabled={!isEditing}
                className={`w-full p-3 rounded-lg ${
                  isEditing
                    ? "border border-gray-300 bg-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                <AiOutlineTeam className="inline-block mr-2" />
                Role
              </label>
              <input
                type="text"
                name="role"
                value={editedDetails.role}
                onChange={handleInputChange}
                placeholder="Not added yet"
                disabled={!isEditing}
                className={`w-full p-3 rounded-lg ${
                  isEditing
                    ? "border border-gray-300 bg-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              />
            </div>

            {/* Organization */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Organization Name
              </label>
              <input
                type="text"
                name="organizationName"
                value={editedDetails.organizationName}
                onChange={handleInputChange}
                placeholder="Not added yet"
                disabled={!isEditing}
                className={`w-full p-3 rounded-lg ${
                  isEditing
                    ? "border border-gray-300 bg-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                <FiPhone className="inline-block mr-2" />
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={editedDetails.phone}
                onChange={handleInputChange}
                placeholder="Not added yet"
                disabled={!isEditing}
                className={`w-full p-3 rounded-lg ${
                  isEditing
                    ? "border border-gray-300 bg-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              />
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Experience Level
              </label>
              <input
                type="text"
                name="experienceLevel"
                value={editedDetails.experienceLevel}
                onChange={handleInputChange}
                placeholder="Not added yet"
                disabled={!isEditing}
                className={`w-full p-3 rounded-lg ${
                  isEditing
                    ? "border border-gray-300 bg-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              />
            </div>
          </form>
        </div>

        {/* Edit and Save Buttons */}
        <div className="text-center mt-10">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-purple-600 text-white py-2 px-6 rounded-full hover:bg-purple-700 transition"
              >
                <FaSave className="inline-block mr-2" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-400 text-white py-2 px-6 rounded-full hover:bg-gray-500 transition ml-4"
              >
                <FaTimes className="inline-block mr-2" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEditToggle}
              className="bg-purple-600 text-white py-2 px-6 rounded-full hover:bg-purple-700 transition"
            >
              Edit
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className=" text-white py-4 text-center mt-10"></footer>
    </div>
  );
};

export default Profile;
