import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51QS0yZJDUj9ArTtKWG5Espc1cGGzqoVEsEhaktzAvfT5NXAM6q6ZVEZAvA7TMEZsvZeqIz09PHtfpdoWxPmdwiSv006wFVDKpE"
);

const StripeCardInput = () => {
  return (
    <div>
      <label htmlFor="card-element">Credit or Debit Card</label>
      <CardElement id="card-element" />
    </div>
  );
};

const EventSearch = () => {
  const [filters, setFilters] = useState({ date: "", location: "", type: "" });
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const searchEvents = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(
        `http://localhost:5000/api/events/search?${queryParams}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching events.");
    }
  };

  const bookEvent = async (eventId, tickets, totalAmount) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.email) {
        throw new Error("User email not found. Please log in.");
      }

      const attendeeEmail = user.email;

      const response = await fetch("http://localhost:5000/api/events/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, tickets, attendeeEmail }),
      });

      if (!response.ok) {
        const errorMessage =
          (await response.json()).message || "Failed to book tickets";
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setPaymentIntent(data.clientSecret);
      setTotalAmount(data.totalAmount);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred while booking tickets.");
    }
  };

  const handlePaymentSubmit = async (eventId) => {
    if (!stripe || !elements || !paymentIntent) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent: confirmedPaymentIntent } =
      await stripe.confirmCardPayment(paymentIntent, {
        payment_method: {
          card: cardElement,
        },
      });

    if (error) {
      console.error(error.message);
      alert("Payment failed");
    } else {
      if (confirmedPaymentIntent.status === "succeeded") {
        alert("Payment successful, your tickets are booked!");
        searchEvents();
      }
    }
  };

  const downloadTicket = async (eventId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.email) {
        throw new Error("User email not found. Please log in.");
      }

      const attendeeEmail = user.email;

      const response = await fetch(
        "http://localhost:5000/api/events/download-ticket",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId, attendeeEmail }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate E-Ticket");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `E-Ticket-${eventId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url); // Clean up
    } catch (err) {
      console.error(err);
      setError("An error occurred while downloading the E-Ticket.");
    }
  };

  return (
    <div>
      <h2>Event Search</h2>
      <div>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Type:
          <input
            type="text"
            name="type"
            value={filters.type}
            onChange={handleInputChange}
          />
        </label>
        <button onClick={searchEvents}>Search</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <h3>Available Events</h3>
        {events.length > 0 ? (
          <ul>
            {events.map((event) => (
              <li key={event._id}>
                <p>
                  <strong>{event.name}</strong> - {event.date} -{" "}
                  {event.location} - {event.type} - Tickets Available:{" "}
                  {event.availableTickets}
                </p>
                <input
                  type="number"
                  placeholder="Enter number of tickets"
                  id={`tickets-${event._id}`}
                  min="1"
                  max={event.availableTickets}
                />
                <button
                  onClick={() => {
                    const tickets = parseInt(
                      document.getElementById(`tickets-${event._id}`).value,
                      10
                    );
                    if (tickets > 0) {
                      const totalAmount = event.amount * tickets;
                      alert(`Total amount to pay: $${totalAmount / 100}`);
                      bookEvent(event._id, tickets, totalAmount);
                    } else {
                      alert("Please enter a valid number of tickets");
                    }
                  }}
                >
                  Book Tickets
                </button>
                {paymentIntent && (
                  <div>
                    <StripeCardInput />
                    <button onClick={() => handlePaymentSubmit(event._id)}>
                      Pay Now
                    </button>
                  </div>
                )}
                <button onClick={() => downloadTicket(event._id)}>
                  Download E-Ticket
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </div>
  );
};

const StripeEventSearch = () => {
  return (
    <Elements stripe={stripePromise}>
      <EventSearch />
    </Elements>
  );
};

export default StripeEventSearch;
