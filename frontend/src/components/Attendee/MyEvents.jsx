// Showing Events for which an attendee resgistered and allowing download of e tickets

import React, { useState, useEffect } from "react";
import {
  FaTicketAlt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaDollarSign,
} from "react-icons/fa";
import { MdEvent, MdDateRange } from "react-icons/md";
import { FiDollarSign } from "react-icons/fi";

const MyEvents = () => {
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
  const user = JSON.parse(localStorage.getItem("user"));
  const [tickets, setTickets] = useState([]);
  const [topRatedEvents, setTopRatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/tickets/user/${user.id}`
        );
        const data = await response.json();
        setTickets(data);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
        setError("Failed to load tickets.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTickets();
    }
  }, [user]);

  useEffect(() => {
    const popularEvents = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/events/trending"
        );
        const data = await response.json();

        const selectedEvents = data.map((event) => {
          return {
            ...event,
            image: imageList[Math.floor(Math.random() * imageList.length)],
          };
        });

        setTopRatedEvents(selectedEvents);
      } catch (err) {
        console.error("Failed to fetch top-rated events:", err);
        setError("Failed to load top-rated events.");
      }
    };

    // Fetch popular events only once
    popularEvents();
  }, []); // Empty dependency array ensures it runs only once

  const cancelTicket = async (ticketId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tickets/cancel/${ticketId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to cancel ticket");

      setTickets(tickets.filter((ticket) => ticket._id !== ticketId));
    } catch (err) {
      setError("Error canceling ticket.");
      console.error("Cancel ticket error:", err);
    }
  };

  const downloadTicket = async (event) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.email) throw new Error("Please log in to download ticket");

      const eventId = event._id;
      const response = await fetch(
        "http://localhost:5000/api/events/download-ticket",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId,
            attendeeEmail: user.email,
          }),
        }
      );
      // const responseText = await response.text();

      if (!response.ok) throw new Error("Failed to generate E-Ticket");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `E-Ticket-${eventId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
      console.error("Ticket download error:", err); // Add more logging to troubleshoot
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white animate-pulse">
        <p className="text-2xl font-bold">Loading your tickets...</p>
      </div>
    );
  }

  if (!tickets.length && !topRatedEvents.length) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white">
        <p className="text-2xl font-bold">
          No tickets or top-rated events found!
        </p>
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
      <h1 className="text-4xl font-extrabold mb-10 text-center drop-shadow-lg">
        <FaTicketAlt className="inline-block mr-3 text-yellow-400 animate-bounce" />
        My Events
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
            className="bg-gray-800 text-white p-6 rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <MdEvent className="text-yellow-400 mr-2" />
              {ticket.eventName}
            </h2>
            <p className="text-lg mb-2">
              <MdDateRange className="inline-block text-yellow-400 mr-2" />
              Booking Date:{" "}
              <span className="text-yellow-300">
                {new Date(ticket.bookingDate).toLocaleDateString()}
              </span>
            </p>
            <p className="text-lg mb-2">
              <FaTicketAlt className="inline-block text-yellow-400 mr-2" />
              Tickets Booked:{" "}
              <span className="text-yellow-300">{ticket.ticketsBooked}</span>
            </p>
            <p className="text-lg">
              <FiDollarSign className="inline-block text-yellow-400 mr-2" />
              Total Price:{" "}
              <span className="text-yellow-300">${ticket.totalPrice}</span>
            </p>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => downloadTicket(ticket.eventid)}
                className="bg-yellow-400 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 hover:text-white transition-all duration-300 shadow-lg"
              >
                Download Ticket
              </button>
              <button
                onClick={() => cancelTicket(ticket._id)}
                className="bg-red-400 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg"
              >
                Cancel Ticket
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-3xl font-extrabold mt-16 mb-8 text-center drop-shadow-lg">
        Top Rated Events
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 py-6">
        {topRatedEvents.map((event) => (
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
                  <FaDollarSign className="mr-2 h-4 w-4" />${event.amount}
                </p>
                <p className="flex items-center">
                  <FaTicketAlt className="mr-2 h-4 w-4" />
                  {event.availableTickets} tickets available
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyEvents;
