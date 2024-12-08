import React, { useState, useEffect } from "react";
import {
  FaTicketAlt,
  FaMoneyBillWave,
  FaChartLine,
  FaCheckCircle,
} from "react-icons/fa";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const EventAnalytics = () => {
  const org = JSON.parse(localStorage.getItem("user"));
  const [summary, setSummary] = useState({
    totalTicketsSold: 0,
    totalRevenue: 0,
    checkInsCompleted: 0,
    netProfit: 0,
  });

  const [ticketSalesData, setTicketSalesData] = useState([]);
  const [revenueDistribution, setRevenueDistribution] = useState([]);
  const [feedbackSummary, setFeedbackSummary] = useState({
    wordCloud: [],
    overallRating: 0,
  });

  // Fetch summary data from backend
  const fetchSummaryData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/events/analytics/${org.id}`
      );

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (data) {
          setSummary(data.summary || {});
          setTicketSalesData(data.ticketSalesData || []);
          setRevenueDistribution(data.revenueDistribution || []);
          setFeedbackSummary(data.feedbackSummary || {});
        } else {
          console.error("No data returned from analytics API.");
        }
      } else {
        throw new Error("Response is not valid JSON");
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
  };
  useEffect(() => {
    fetchSummaryData();
  }, []);

  const handleDownloadReport = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/events/download-analytics",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orgId: org.id,
            orgName: org.name,
            organizerEmail: org.email,
            totalRevenue: summary.totalRevenue,
            totalfeedback: summary.checkInsCompleted,
            totalTicketsSold: summary.totalTicketsSold,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const blob = await response.blob(); // Handle PDF response
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Report-${org.id}.pdf`;

      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
    } catch (error) {
      console.error("Failed to download  report:", error);
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
      {/* Hero Section */}
      <header className="text-center py-10">
        <h1 className="text-4xl font-extrabold">Event Analytics</h1>
        <p className="text-lg mt-2">
          Discover insights to boost your event's success!
        </p>
      </header>

      <div className="container mx-auto px-6 py-6">
        {/* Metrics Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <FaTicketAlt className="text-blue-500 text-3xl mb-4" />
            <h3 className="text-2xl font-bold">{summary.totalTicketsSold}</h3>
            <p className="text-gray-700">Total Tickets Sold</p>
          </div>
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <FaMoneyBillWave className="text-green-500 text-3xl mb-4" />
            <h3 className="text-2xl font-bold">${summary.totalRevenue}</h3>
            <p className="text-gray-700">Total Revenue</p>
          </div>
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <FaCheckCircle className="text-yellow-500 text-3xl mb-4" />
            <h3 className="text-2xl font-bold">{summary.checkInsCompleted}</h3>
            <p className="text-gray-700">Total Feedback</p>
          </div>
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <FaChartLine className="text-red-500 text-3xl mb-4" />
            <h3 className="text-2xl font-bold">${summary.netProfit}</h3>
            <p className="text-gray-700">Net Profit</p>
          </div>
        </div>

        {/* Graph Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Ticket Sales Over Time */}
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Ticket Sales Over Time</h3>
            <Line
              data={{
                labels: ticketSalesData.map((d) => d.date),
                datasets: [
                  {
                    label: "Tickets Sold",
                    data: ticketSalesData.map((d) => d.ticketsSold),
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: true, position: "top" },
                },
              }}
            />
          </div>

          {/* Revenue Distribution */}
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Revenue Distribution</h3>
            <Pie
              data={{
                labels: revenueDistribution.map((d) => d.eventName),
                datasets: [
                  {
                    data: revenueDistribution.map((d) => d.revenue),
                    backgroundColor: [
                      "rgba(255, 99, 132, 0.2)",
                      "rgba(54, 162, 235, 0.2)",
                      "rgba(255, 206, 86, 0.2)",
                    ],
                    borderColor: [
                      "rgba(255, 99, 132, 1)",
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 206, 86, 1)",
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: true, position: "top" },
                },
              }}
            />
          </div>
        </div>

        {/* Feedback Summary Section */}
        <div className="bg-white text-black p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-xl font-bold mb-4">Feedback Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Word Cloud */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Comments</h4>
              <div className="flex flex-wrap gap-2">
                {feedbackSummary.wordCloud.map((word, idx) => (
                  <span
                    key={idx}
                    className="bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            {/* Overall Rating */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Overall Rating</h4>
              <p className="text-4xl font-bold">
                {feedbackSummary.overallRating}/5
              </p>
            </div>
          </div>
        </div>

        {/* Call-to-Action Section */}
        <div className="text-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-4"
            onClick={handleDownloadReport}
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics;
