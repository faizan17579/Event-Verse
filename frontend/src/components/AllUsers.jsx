import React, { useState, useEffect } from "react";
import { FaUserAlt, FaTrash } from "react-icons/fa";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all users from the backend
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/all");
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError("Failed to load users. Please try again later.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete user profile
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/delete/${userId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete user");

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      alert("User profile deleted successfully!");
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("An error occurred while deleting the user.");
    }
  };

  if (loading) return <p>Loading...</p>;

  // Group users by their roles
  const groupedUsers = users.reduce((acc, user) => {
    const { role } = user;
    if (!acc[role]) acc[role] = [];
    acc[role].push(user);
    return acc;
  }, {});

  return (
    <div
    className="min-h-screen text-white"
    style={{
      backgroundImage: `linear-gradient(to right, rgba(242, 98, 152, 0.3), rgba(242, 98, 152, 0.7)), url('./images/login_bc.png')`,
      backgroundSize: "cover",
    }}
  >
      <div className="container mx-auto px-6 py-10">
        <h2 className="text-4xl font-bold mb-6 text-yellow-400 text-center">
          All Users
        </h2>

        {error && (
          <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {Object.keys(groupedUsers).map((role) => (
          <div key={role} className="mb-8">
            <h3 className="text-2xl font-bold text-indigo-400 mb-4">
              {role}s
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedUsers[role].map((user) => (
                <div
                  key={user._id}
                  className="bg-gray-800 rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:scale-105"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <FaUserAlt className="text-indigo-400 text-4xl" />
                    <div>
                      <p className="font-bold text-lg">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>   
                    </div>
                    
                  </div>


                  <p>
                    <strong>Role:</strong> {user.role}
                  </p>

                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white rounded py-2 px-4 flex items-center justify-center space-x-2"
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
