// View ing Tickets for all registered events

import React, { useState, useEffect } from "react";
import { FaTicketAlt } from "react-icons/fa";
import { MdEvent, MdDateRange } from "react-icons/md";
import { FiDollarSign } from "react-icons/fi";

const ViewTickets = () => {
  const user = JSON.parse(localStorage.getItem("user")); // Parse the user details from localStorage
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch tickets based on user ID
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/tickets/user/${user.id}`
        );
        const data = await response.json();
        setTickets(data);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTickets();
    }
  }, [user]);

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

  if (!tickets.length) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white">
        <p className="text-2xl font-bold">No tickets found!</p>
        <p className="text-lg mt-2">Book your first event now!</p>
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
      <h1 className="text-4xl font-extrabold mb-10 text-center drop-shadow-lg">
        <FaTicketAlt className="inline-block mr-3 text-yellow-400 animate-bounce" />
        My Tickets
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
            className="relative bg-gray-800 text-white p-6 rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300 group"
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
            <button
              onClick={() => downloadTicket(ticket.eventid)}
              className="absolute bottom-6 right-6 bg-yellow-400 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 hover:text-white transition-all duration-300 shadow-lg"
            >
              Download Ticket
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewTickets;
