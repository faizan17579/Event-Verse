import React, { useState, useEffect } from "react";

const SetDiscounts = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [appliedEvent, setAppliedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events/all-events", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError("Failed to load events. Please try again later.");
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDiscountChange = (eventId, discount) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event._id === eventId ? { ...event, discount } : event
      )
    );
  };

  const handleCategoryChange = (eventId, category) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event._id === eventId ? { ...event, category } : event
      )
    );
  };

  const handleSubmit = async (eventId) => {
    try {
      const event = events.find((event) => event._id === eventId);
      const response = await fetch(`http://localhost:5000/api/events/discounts/apply`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId: event._id, discountPercentage: event.discount, category: event.category }),
      });

      if (!response.ok) {
        throw new Error("Failed to set discount");
      }

      setMessage(`Discount set successfully for event: ${event.name}`);
      setAppliedEvent(event);
    } catch (error) {
      console.error("Error setting discount:", error);
      setMessage("Failed to set discount. Please try again later.");
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
        backgroundImage: `linear-gradient(to right, rgba(242, 98, 152, 0.3), rgba(242, 98, 152, 0.7)), url('/images/login_bc.png')`,
        backgroundSize: "cover",
      }}
    >
      <div className="container mx-auto px-6 py-10">
        <h2 className="text-4xl font-bold mb-6 text-yellow-400 text-center">
          Set Discounts
        </h2>

        {error && (
          <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className="bg-gray-900 rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:scale-105">
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(event._id); }}>
                <h3 className="text-2xl font-bold mb-2">{event.name}</h3>
                <p className="mb-2">{new Date(event.date).toLocaleDateString()}</p>
                <p className="mb-2">{event.location}</p>
                <div className="mb-4">
                  <label className="block text-lg mb-2">Discount Percentage:</label>
                  <input
                    type="number"
                    value={event.discount || 0}
                    onChange={(e) => handleDiscountChange(event._id, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="100"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-lg mb-2">Discount Category:</label>
                  <select
                    value={event.category || "general"}
                    onChange={(e) => handleCategoryChange(event._id, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="general">General</option>
                    <option value="new-year">New Year</option>
                    <option value="christmas">Christmas</option>
                    <option value="black-friday">Black Friday</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
                >
                  Set Discount
                </button>
              </form>
            </div>
          ))}
        </div>
        {message && <p className="mt-4 text-center">{message}</p>}
        {appliedEvent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-2">Discount Applied</h3>
              <p className="mb-2">Event: {appliedEvent.name}</p>
              <p className="mb-2">Category: {appliedEvent.category}</p>
              <p className="mb-2">Discount: {appliedEvent.discount}%</p>
              <button
                onClick={() => setAppliedEvent(null)}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetDiscounts;