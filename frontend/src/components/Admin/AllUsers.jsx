import React, { useState, useEffect } from "react";
import { FaUserAlt, FaTrash, FaExclamationCircle, FaHistory } from "react-icons/fa";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userActivities, setUserActivities] = useState({});
  const [userComplaints, setUserComplaints] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Fetch all users from the backend
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

  // Fetch user activities
  const handleMonitorActivities = async (userId) => {
    try {
        // set userActivities state to null to clear previous activities
        setUserActivities(null);
      const response = await fetch(
        `http://localhost:5000/api/activities/user-activities/${userId}`
      );
        const data = await response.json();
     

        if (data.activities && data.activities.length > 0) {
            setUserActivities({
              [userId]: data.activities, // Add activities only for the specific user
            });
          } else {
            setUserActivities(null);
          }
      setModalOpen(true);
     
    } catch (err) {
      console.error("Failed to load activities", err);
      alert("Failed to load activities.");
    }
  };

  // Fetch user complaints
  const handleViewComplaints = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}/complaints`
      );
      const data = await response.json();

      setUserComplaints((prev) => ({
        ...prev,
        [userId]: data.complaints || [],
      }));

      alert(`Complaints for User ID ${userId} loaded!`);
    } catch (err) {
      console.error("Failed to load complaints", err);
      alert("Failed to load complaints.");
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
                    
                  <div className="mt-4 flex flex-col space-y-2">
  <button
    onClick={() => handleMonitorActivities(user._id)}
    className="w-full bg-blue-600 text-white rounded px-3 py-2 flex items-center justify-center"
  >
    <FaHistory className="mr-2" />
    <span>Activities</span>
  </button>

  <button
    onClick={() => handleViewComplaints(user._id)}
    className="w-full bg-red-600 text-white rounded px-3 py-2 flex items-center justify-center"
  >
    <FaExclamationCircle className="mr-2" />
    <span>Complaints</span>
  </button>

  <button
    onClick={() => handleDeleteUser(user._id)}
    className="w-full bg-red-500 hover:bg-red-700 text-white rounded px-3 py-2 flex items-center justify-center"
  >
    <FaTrash className="mr-2" />
    <span>Delete</span>
  </button>
</div>

                

                  {/* Show complaints */}
                  {userComplaints[user._id] && (
                    <div className="mt-2 text-gray-400">
                      {userComplaints[user._id].map((complaint, idx) => (
                        <p key={idx}>{complaint}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {modalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
    <div className="bg-gray-900 rounded-lg shadow-lg p-8 max-w-4xl mx-auto transform transition-transform duration-300">
      
      {/* Close Button */}
      <button
        onClick={() => setModalOpen(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
      >
        ✖
      </button>

      <h3 className="text-2xl font-bold mb-4 text-indigo-400 text-center">
        User Activities
      </h3>

      {/* Grid Container for Activities */}
    {/* Grid Container for Activities */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {userActivities && Object.keys(userActivities).length > 0 ? (
    Object.keys(userActivities).flatMap((userId) =>
      userActivities[userId].map((activity, idx) => {
        switch (activity.type) {
          case "Ticket":
            return (
              <div key={`${userId}-${idx}`} className="p-4 bg-gray-800 rounded-lg shadow">
                <p><strong>Type:</strong> Ticket</p>
                <p><strong>Event Name:</strong> {activity.action}</p>
                <p><strong>Tickets Booked:</strong> {activity.description}</p>
                <p><strong>Booking Date:</strong> {new Date(activity.date).toLocaleString()}</p>
              </div>
            );

          case "Feedback":
            return (
              <div key={`${userId}-${idx}`} className="p-4 bg-gray-800 rounded-lg shadow">
                <p><strong>Type:</strong> Feedback</p>
                <p><strong>Comment:</strong> {activity.message}</p>
                <p><strong>Submitted At:</strong> {new Date(activity.date).toLocaleString()}</p>
              </div>
            );
          case "Event":
            return (
              <div key={`${userId}-${idx}`} className="p-4 bg
              -gray-800 rounded-lg shadow">
                <p><strong>Type:</strong> Event</p>
                <p><strong>Action:</strong> {activity.action}</p>
                <p><strong>Created At:</strong> {new Date(activity.date).toLocaleString()}</p>
              </div>
            );

          default:
            return (
              <div key={`${userId}-${idx}`} className="p-4 bg-gray-800 rounded-lg shadow">
                <p><strong>Action:</strong> {activity.type}</p>
                <p><strong>Details:</strong> {activity.message}</p>
              </div>
            );
        }
      })
    )
  ) : (
    <div className="col-span-full text-gray-400 mt-4 text-center">
      <p className="text-2xl font-bold">No activities yet.</p>
      <p>Perform some actions to see them here.</p>
    </div>
  )}
</div>


      {/* Close Button */}
      <button
        onClick={() => setModalOpen(false)}
        className="mt-6 bg-red-500 text-white rounded py-2 px-4 w-full"
      >
        Close
      </button>

    </div>
  </div>
)}



    </div>
  );
  
};

export default AllUsers;
