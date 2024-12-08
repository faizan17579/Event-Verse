// Adding filters for Browsing Events

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDollarSign,
  FaTicketAlt,
  FaGlobe,
  FaLocationArrow,
  FaMusic,
} from "react-icons/fa";

const BrowseEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    date: "",
    location: "",
    type: "",
    nearby: false,
  });
  const [selectedTickets, setSelectedTickets] = useState({});
  const [userLocation, setUserLocation] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const imageList = [
    "/images/events/classicalSerenade.png",
    "/images/events/countryLegends.png",
    "/images/events/Marathon.png",
    "/images/events/RockFestival.png",
    "/images/events/ElectricSymphony.png",
    "/images/events/MelodyMania.png",
    "/images/events/MetroPolisMarathon.png",
    "/images/events/musicalFusion.png",
  ];

  useEffect(() => {
    fetchUserLocation();
    fetchEvents();
  }, []);

  const fetchUserLocation = async () => {
    try {
      const response = await fetch(
        "https://ipinfo.io/json?token=9082a1eb05bd36"
      );
      const data = await response.json();
      setUserLocation(data.city || "Unknown Location");
    } catch (err) {
      console.error("Error fetching user location:", err);
      setUserLocation("Unknown Location");
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/events/all-events"
      );
      if (!response.ok) throw new Error("Failed to fetch events");

      const data = await response.json();
      const activeEvents = data
        .filter((event) => !event.isEnded)
        .map((event) => ({
          ...event,
          image: imageList[Math.floor(Math.random() * imageList.length)],
        }));

      setEvents(activeEvents);
      setFilteredEvents(activeEvents);
    } catch (err) {
      setError("Failed to load events. Please try again later.");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const filtered = events.filter((event) => {
      const matchesDate =
        !filters.date ||
        new Date(event.date).toLocaleDateString() ===
          new Date(filters.date).toLocaleDateString();
      const matchesLocation =
        !filters.location ||
        event.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesType =
        !filters.type ||
        event.type.toLowerCase().includes(filters.type.toLowerCase());
      const matchesNearby =
        !filters.nearby ||
        (userLocation &&
          event.location.toLowerCase().includes(userLocation.toLowerCase()));
      return matchesDate && matchesLocation && matchesType && matchesNearby;
    });
    setFilteredEvents(filtered);
  };

  const toggleNearbyFilter = () => {
    setFilters((prev) => {
      const updatedFilters = { ...prev, nearby: !prev.nearby };
      if (!prev.nearby) {
        // If turning on nearby filter, apply it immediately
        const filtered = events.filter((event) =>
          event.location.toLowerCase().includes(userLocation.toLowerCase())
        );
        setFilteredEvents(filtered);
      } else {
        // If turning off nearby filter, reset filters
        setFilteredEvents(events);
      }
      return updatedFilters;
    });
  };

  const resetFilters = () => {
    setFilters({ date: "", location: "", type: "", nearby: false });
    setFilteredEvents(events); // Reset to the full event list
  };

  const handleTicketSelection = async (event, ticketCount) => {
    if (!ticketCount || ticketCount <= 0) {
      alert("Please select a valid number of tickets");
      return;
    }

    const totalAmount = event.amount * ticketCount;

    navigate("/payment", {
      state: {
        event,
        eventId: event._id,
        tickets: ticketCount,
        totalAmount,
        eventName: event.name,
      },
    });
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
        backgroundImage: `linear-gradient(to right, rgba(242, 98, 152, 0.3), rgba(242, 98, 152, 0.7)), url('./images/login_bc.png')`,
        backgroundSize: "cover",
      }}
    >
      {error && (
        <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <header className="text-center py-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 animate-bounce">
          Discover <span className="text-yellow-400">Events</span>
        </h1>
        <p className="text-xl max-w-3xl mx-auto text-gray-100">
          Explore and book tickets for exciting events near you.
        </p>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-3 text-indigo-300" />
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-3 text-indigo-300" />
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Filter by Location"
              className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="relative">
            <FaGlobe className="absolute left-3 top-3 text-indigo-300" />
            <input
              type="text"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              placeholder="Filter by Type"
              className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>
        <div className="flex items-center mt-6 space-x-4">
          <button
            onClick={applyFilters}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-8 rounded-full transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply Filters
          </button>

          <button
            onClick={resetFilters}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-8 rounded-full transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Reset Filters
          </button>
          <button
            onClick={toggleNearbyFilter}
            className={`flex items-center py-2 px-8 rounded-full transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              filters.nearby
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-600 hover:bg-gray-700 text-white"
            }`}
          >
            <FaLocationArrow className="mr-2" />
            {filters.nearby ? "Nearby Filter On" : "Nearby Filter Off"}
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-gray-900 text-white p-6 rounded-lg shadow-xl transform transition-transform duration-300 hover:scale-105"
            >
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <div className="p-6">
                <h3 className="text-center text-2xl font-bold mb-2 text-yellow-400 uppercase">
                  {event.name}
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p className="flex items-center">
                    <FaCalendarAlt className="mr-2 h-4 w-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 h-4 w-4" />
                    {event.location}
                  </p>
                  <p className="flex items-center">
                    <FaMusic className="mr-2 h-4 w-4" />
                    {event.type}
                  </p>
                  <p className="flex items-center">
                    <FaDollarSign className="mr-2 h-4 w-4" />${event.amount}
                  </p>
                  <p className="flex items-center">
                    <FaTicketAlt className="mr-2 h-4 w-4" />
                    {event.availableTickets} tickets available
                  </p>
                </div>
                <div className="mt-4 space-y-4">
                  <input
                    type="number"
                    min="1"
                    max={event.availableTickets}
                    placeholder="Number of tickets"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) =>
                      setSelectedTickets({
                        ...selectedTickets,
                        [event._id]: parseInt(e.target.value),
                      })
                    }
                  />
                  <button
                    onClick={() =>
                      handleTicketSelection(event, selectedTickets[event._id])
                    }
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Book Tickets
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-800 text-2xl font-bold">
              No events found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseEvents;
