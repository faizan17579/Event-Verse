import React, { useState, useEffect } from "react";
import { FaChartLine, FaTicketAlt, FaMoneyBillWave } from "react-icons/fa";

const TicketSalesPage = () => {
  // Retrieve the organizer's data from localStorage
  const org = JSON.parse(localStorage.getItem("user"));
  const [salesData, setSalesData] = useState([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalTicketsSold: 0,
    totalEvents: 0,
  });
  const [filters, setFilters] = useState({
    eventName: "",
    dateRange: "",
    organizerId: org?.id || "",  // Pass the actual organizer ID
  });

  // Fetch sales data from the backend API
  const fetchSalesData = async () => {
    try {
      const { eventName, dateRange, organizerId } = filters;
      const queryParams = new URLSearchParams({
        organizerId,
        eventName,
        dateRange,
      });

      const response = await fetch(
        `http://localhost:5000/api/events/ticket-sales?${queryParams}`
      );

      const data = await response.json();

      if (data) {
        const { summary, salesData } = data;
        setSummary(summary);
        setSalesData(salesData);
      }
    } catch (error) {
      console.error("Failed to fetch sales data", error);
    }
  };

  // Call API on component mount
  useEffect(() => {
    if (filters.organizerId) {
      fetchSalesData();
    }
  }, []);

  // Handle input changes for filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-500 text-white">
      <header className="text-center py-10">
        <h1 className="text-4xl font-extrabold">Ticket Sales</h1>
        <p className="text-lg mt-2">
          Monitor ticket sales, track revenue, and ensure event success.
        </p>
      </header>

      <div className="container mx-auto px-6 py-6">
        {/* Sales Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <FaMoneyBillWave className="text-green-500 text-3xl mb-4" />
            <h3 className="text-2xl font-bold">${summary.totalRevenue}</h3>
            <p className="text-gray-700">Total Revenue</p>
          </div>
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <FaTicketAlt className="text-blue-500 text-3xl mb-4" />
            <h3 className="text-2xl font-bold">{summary.totalTicketsSold}</h3>
            <p className="text-gray-700">Total Tickets Sold</p>
          </div>
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <FaChartLine className="text-yellow-500 text-3xl mb-4" />
            <h3 className="text-2xl font-bold">{summary.totalEvents}</h3>
            <p className="text-gray-700">Total Events</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Filter Inputs */}
          <input
            type="text"
            name="eventName"
            value={filters.eventName}
            onChange={handleFilterChange}
            placeholder="Filter by Event Name"
            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="date"
            name="dateRange"
            value={filters.dateRange}
            onChange={handleFilterChange}
            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400"
          />
          {/* Apply and Reset Buttons */}
          <div className="flex items-center justify-start space-x-4">
            <button
              onClick={fetchSalesData}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-600"
            >
              Apply
            </button>
            <button
  onClick={() => {
    setFilters({
      eventName: "",
      dateRange: "",
      organizerId: org?.id || "",
    });
    fetchSalesData();  // Fetch fresh data after resetting
  }}
  className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600"
>
  Reset
</button>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white text-black p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Sales Details</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Tickets Sold</th>
                <th>Revenue</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((sale, index) => (
                <tr key={index} className="text-center">
                  <td>{sale.eventName}</td>
                  <td>{sale.ticketsSold}</td>
                  <td>${sale.revenue}</td>
                  <td>{new Date(sale.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TicketSalesPage;
