import React, { useState, useEffect } from "react";

const TicketSalesPage = () => {
  const org = JSON.parse(localStorage.getItem("user"));
  const [salesData, setSalesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    eventName: "",
    dateRange: "",
    location: "",
    organizerId: org?.id || "",
  });

  const fetchSalesData = async () => {
    try {
      const { eventName, dateRange, location, organizerId } = filters;
      const queryParams = new URLSearchParams({
        organizerId,
        eventName,
        dateRange,
        location,
      });

      const response = await fetch(
        `http://localhost:5000/api/events/ticket-sales?${queryParams}`
      );
      const data = await response.json();

      if (data && Array.isArray(data.salesData)) {
        const filteredSalesData = data.salesData.filter((sale) => {
          const saleDate = new Date(sale.date).toLocaleDateString("en-US");
          const filterDate = dateRange
            ? new Date(dateRange).toLocaleDateString("en-US")
            : null;

          const matchesDate = !filterDate || saleDate === filterDate;
          const matchesLocation =
            !location ||
            sale.location.toLowerCase().includes(location.toLowerCase());
          const matchesEventName =
            !eventName ||
            sale.eventName.toLowerCase().includes(eventName.toLowerCase());

          return matchesDate && matchesLocation && matchesEventName;
        });

        setSalesData(filteredSalesData);
      } else {
        setSalesData([]);
      }
    } catch (error) {
      console.error("Failed to fetch sales data", error);
      setSalesData([]);
    }
  };

  useEffect(() => {
    if (filters.organizerId) {
      fetchSalesData();
    }
  }, [filters.organizerId]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    const defaultFilters = {
      eventName: "",
      dateRange: "",
      location: "",
      organizerId: org?.id || "",
    };
    setFilters(defaultFilters);
    setCurrentPage(1);
    fetchSalesData();
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = Array.isArray(salesData)
    ? salesData.slice(indexOfFirstRow, indexOfLastRow)
    : [];

  const totalPages = Math.ceil(salesData.length / rowsPerPage);

  return (
    <div
      className="min-h-screen flex flex-col text-white"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(242, 98, 152, 0.3), rgba(242, 98, 152, 0.7)), url('/images/login_bc.png')`,
        backgroundSize: "cover",
      }}
    >
      <header className="text-center py-10">
        <h1 className="text-4xl font-extrabold">Ticket Sales</h1>
        <p className="text-lg mt-2">
          Monitor ticket sales and ensure event success.
        </p>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Filter by Location"
            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400"
          />
          <div className="flex items-center justify-start space-x-4">
            <button
              onClick={fetchSalesData}
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
          </div>
        </div>

        <div className="bg-white text-black p-6 rounded-lg shadow-lg overflow-x-auto">
          <h2 className="text-xl font-bold mb-4">Sales Details</h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">Event Name</th>
                <th className="p-3 border">Tickets Sold</th>
                <th className="p-3 border">Remaining Tickets</th>
                <th className="p-3 border">Revenue</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Location</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((sale, index) => (
                  <tr
                    key={index}
                    className="text-center hover:bg-gray-100 transition cursor-pointer"
                  >
                    <td className="p-3 border">{sale.eventName}</td>
                    <td className="p-3 border">{sale.ticketsSold}</td>
                    <td className="p-3 border">{sale.remainingTickets}</td>
                    <td className="p-3 border">${sale.revenue}</td>
                    <td className="p-3 border">
                      {new Date(sale.date).toLocaleDateString("en-US")}
                    </td>
                    <td className="p-3 border">{sale.location}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="p-6 text-center text-gray-600 font-bold"
                  >
                    No ticket sales data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-gray-500 text-white hover:bg-gray-600"
              }`}
            >
              Previous
            </button>
            <p>
              Page {currentPage} of {totalPages}
            </p>
            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-gray-500 text-white hover:bg-gray-600"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketSalesPage;
