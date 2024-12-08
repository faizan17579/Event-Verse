// Adding payment functionality  with QR code

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  FaDownload,
  FaCreditCard,
  FaTicketAlt,
  FaDollarSign,
  FaArrowLeft,
} from "react-icons/fa";

import { QRCodeCanvas } from "qrcode.react";

// Load Stripe
const stripePromise = loadStripe(
  "pk_test_51QS0yZJDUj9ArTtKWG5Espc1cGGzqoVEsEhaktzAvfT5NXAM6q6ZVEZAvA7TMEZsvZeqIz09PHtfpdoWxPmdwiSv006wFVDKpE"
);

const PaymentForm = ({ clientSecret, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const cardElement = elements.getElement(CardElement);

    try {
      const { paymentIntent, error: stripeError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        setProcessing(false);
        onSuccess(); // Mark payment as successful
      } else {
        setError("Payment was not successful.");
        setProcessing(false);
      }
    } catch (err) {
      console.error("Payment failed:", err);
      setError("An unexpected error occurred.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-gray-700 rounded-md bg-gray-800">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#ffffff",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#fa755a",
              },
            },
          }}
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <FaCreditCard className="mr-2 h-5 w-5" />
        {processing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [qrPaymentLink, setQrPaymentLink] = useState(null);


  const { eventId, tickets, totalAmount, eventName } = location.state || {};


const handleGenerateQR = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.email) throw new Error("Please log in to continue.");

    const response = await fetch("http://localhost:5000/api/events/generate-qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId,
        tickets,
        attendeeEmail: user.email,
        totalAmount
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to generate QR payment link");
    }

    const { paymentLink } = await response.json();
    setQrPaymentLink(paymentLink); // Save the link for QR code generation
  } catch (err) {
    setError(err.message);
    console.error("Error generating QR code:", err);
  }
};



  const initiatePayment = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.email) throw new Error("Please log in to continue");

      const response = await fetch("http://localhost:5000/api/events/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          tickets,
          attendeeEmail: user.email,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to initiate payment");
      }

      const data = await response.json();
      setPaymentIntent(data.clientSecret);
    } catch (err) {
      setError(err.message); // Enhance error handling for visibility
      console.error("Payment initiation error:", err);
    }
  };

  const downloadTicket = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.email) throw new Error("Please log in to download ticket");

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

  const handlePaymentSuccess = async () => {
    try {
      setSuccess(true);
      setPaymentIntent(null);

      // Send ticket data to the server
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.email)
        throw new Error("Please log in to complete ticket booking.");

      const response = await fetch(
        "http://localhost:5000/api/tickets/paymentsuccess",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId,
            ticketsBooked: tickets,
            totalAmount,
            usert: user, // assuming _id is stored in localStorage
            eventName,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save ticket details.");
      }
    } catch (err) {
      console.error("Error handling payment success:", err);
      setError(err.message);
    }
  };

  if (!eventId || !tickets || !totalAmount) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 to-indigo-900">
        <div className="text-center text-white">
          <p className="text-xl">No ticket information available</p>
          <button
            onClick={() => navigate("/browse-events")}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <FaArrowLeft className="mr-2" /> Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-wrap gap-12">
        {/* Ticket Info Section */}
        <div className="flex-1 bg-gray-900 shadow-xl rounded-lg overflow-hidden p-6">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Ticket Summary</h2>
            <div className="border-b border-gray-700 pb-6">
              <h3 className="text-lg font-medium text-white">{eventName}</h3>
              <div className="space-y-2">
                <p className="text-gray-300 flex items-center">
                  <FaTicketAlt className="mr-2" />
                  Number of tickets: {tickets}
                </p>
                <p className="text-gray-300 flex items-center">
                  <FaDollarSign className="mr-2" />
                  Total amount: ${totalAmount}
                </p>
              </div>
            </div>
            {error && (
              <div className="bg-red-900 border-l-4 border-red-500 p-4">
                <p className="text-red-200">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Form Section */}
        <div className="flex-1 bg-gray-900 shadow-xl rounded-lg overflow-hidden p-6">
          <div className="space-y-6">
            {success ? (
              <div className="space-y-4">
                <div className="bg-green-900 border-l-4 border-green-500 p-4">
                  <p className="text-green-200">
                    Payment successful! Your tickets are ready.
                  </p>
                </div>
                <button
                  onClick={downloadTicket}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  <FaDownload className="mr-2 h-5 w-5" />
                  Download E-Ticket
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {!paymentIntent ? (
                  <><button
                      onClick={initiatePayment}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <FaCreditCard className="mr-2 h-5 w-5" />
                      Proceed to Payment
                    </button><button
                      onClick={handleGenerateQR}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 mt-4"
                    >
                        Generate QR for Payment
                      </button>
                     {qrPaymentLink && (
                      <div className="flex flex-col items-center mt-4">
                        <p className="text-white mb-2">Scan the QR code below to make a payment:</p>
                        <QRCodeCanvas value={qrPaymentLink} size={200} />
                      </div>
                    )}
                  
                    </>
                    
                ) : (
                  <Elements stripe={stripePromise}>
                    <PaymentForm
                      clientSecret={paymentIntent}
                      onSuccess={handlePaymentSuccess}
                    />
                  </Elements>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
