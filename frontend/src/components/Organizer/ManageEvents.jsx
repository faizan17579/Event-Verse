import React, { useState, useEffect } from "react";

const ManageEvents = () => {
  const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user details
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editEvent, setEditEvent] = useState(null); // State for event being edited
  const [updatedDetails, setUpdatedDetails] = useState({});

  useEffect(() => {
    // Fetch all events
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/events/org/events"
        );
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEndEvent = async (eventId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/events/end-event/${eventId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ organizerId: user.id }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === eventId ? { ...event, isEnded: true } : event
          )
        );
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Failed to end event:", err);
    }
  };

  const handleEditButton = (event) => {
    setEditEvent(event); // Set the event being edited
    setUpdatedDetails({
      name: event.name || "",
      date: event.date || "",
      location: event.location || "",
      type: event.type || "", // Ensure `type` is included
      availableTickets: event.availableTickets || 0,
    });
  };

  const handleSaveChanges = async () => {
    try {
      if (
        !updatedDetails.name ||
        !updatedDetails.date ||
        !updatedDetails.location
      ) {
        alert("Please fill out all fields.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/events/edit-event/${editEvent._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...updatedDetails, organizerId: user.id }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Event updated successfully!");
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === editEvent._id
              ? { ...event, ...updatedDetails }
              : event
          )
        );
        setEditEvent(null); // Close modal
      } else {
        alert(data.message || "Failed to update event.");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("An error occurred while updating the event.");
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
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="loader border-t-4 border-b-4 border-yellow-400 h-12 w-12 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Header */}
      <header className={`text-center py-10 ${loading ? "blur-sm" : ""}`}>
        <h1 className="text-4xl font-extrabold mb-4 animate-bounce">
          Manage Your Events
        </h1>
        <p className="text-lg max-w-2xl mx-auto">
          End or edit your events below.
        </p>
      </header>

      {/* Event List */}
      <section
        className={`container mx-auto px-6 py-10 ${loading ? "blur-sm" : ""}`}
      >
        {events.length === 0 ? (
          <p className="text-center text-lg">No events found!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-gray-900 text-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
                {/* Event Title */}
                <h3 className="text-2xl font-bold text-center text-yellow-400 mb-4">
                  {event.name}
                </h3>

                {/* Event Details */}
                <p className="text-sm text-gray-300 mb-2">
                  <span className="font-semibold text-indigo-300">Date:</span>{" "}
                  <span className="text-gray-400">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <span className="font-semibold text-indigo-300">
                    Location:
                  </span>{" "}
                  <span className="text-gray-400">{event.location}</span>
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <span className="font-semibold text-indigo-300">
                    Tickets:
                  </span>{" "}
                  <span className="text-gray-400">
                    {event.availableTickets} available
                  </span>
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <span className="font-semibold text-indigo-300">Price:</span>{" "}
                  <span className="text-gray-400">${event.amount}</span>
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <span className="font-semibold text-indigo-300">Type:</span>{" "}
                  {event.type}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  <span className="font-semibold text-indigo-300">
                    Organizer ID:
                  </span>{" "}
                  {event.createdBy}
                </p>
                <p className="text-sm text-gray-300 mb-4">
                  <span className="font-semibold text-indigo-300">
                    Organizer Name:
                  </span>{" "}
                  {event.organizerName || "Unknown"}
                </p>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4">
                  {event.isEnded ? (
                    <span className="text-green-300 italic">Ended</span>
                  ) : event.createdBy === user.id ? (
                    <>
                      <button
                        className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition"
                        onClick={() => handleEndEvent(event._id)}
                      >
                        End
                      </button>
                      <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition"
                        onClick={() => handleEditButton(event)} // Opens the modal with pre-filled data
                      >
                        Edit
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400 italic">
                      No actions available
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Event Modal */}
        {editEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white text-black rounded-lg p-8 w-96">
              <h2 className="text-xl font-bold mb-4">Edit Event</h2>

              {/* Labels and Input Fields */}
              <label className="block text-sm font-bold mb-2">
                Event Title
              </label>
              <input
                type="text"
                className="w-full mb-4 p-2 border rounded"
                value={updatedDetails.name}
                onChange={(e) =>
                  setUpdatedDetails({ ...updatedDetails, name: e.target.value })
                }
              />

              <label className="block text-sm font-bold mb-2">Event Date</label>
              <input
                type="date"
                className="w-full mb-4 p-2 border rounded"
                value={updatedDetails.date}
                onChange={(e) =>
                  setUpdatedDetails({ ...updatedDetails, date: e.target.value })
                }
              />

              <label className="block text-sm font-bold mb-2">
                Event Location
              </label>
              <input
                type="text"
                className="w-full mb-4 p-2 border rounded"
                value={updatedDetails.location}
                onChange={(e) =>
                  setUpdatedDetails({
                    ...updatedDetails,
                    location: e.target.value,
                  })
                }
              />

              <label className="block text-sm font-bold mb-2">
                Available Tickets
              </label>
              <input
                type="number"
                className="w-full mb-4 p-2 border rounded"
                value={updatedDetails.availableTickets}
                onChange={(e) =>
                  setUpdatedDetails({
                    ...updatedDetails,
                    availableTickets: e.target.value,
                  })
                }
              />

              <label className="block text-sm font-bold mb-2">Event Type</label>
              <input
                type="text"
                className="w-full mb-4 p-2 border rounded"
                value={updatedDetails.type || ""}
                onChange={(e) =>
                  setUpdatedDetails({ ...updatedDetails, type: e.target.value })
                }
              />

              <label className="block text-sm font-bold mb-2">Price</label>
              <input
                type="number"
                className="w-full mb-4 p-2 border rounded"
                value={updatedDetails.amount || ""}
                onChange={(e) =>
                  setUpdatedDetails({
                    ...updatedDetails,
                    amount: e.target.value,
                  })
                }
              />

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                  onClick={() => setEditEvent(null)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  onClick={handleSaveChanges}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ManageEvents;
