import React, { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { FaUserFriends, FaCalendarAlt, FaStar } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const ViewReports = () => {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsResponse, usersResponse, feedbackResponse] =
          await Promise.all([
            fetch("http://localhost:5000/api/events/all-events"),
            fetch("http://localhost:5000/api/users/all"),
            fetch("http://localhost:5000/api/feedback/all"),
          ]);

        const eventsData = await eventsResponse.json();
        const usersData = await usersResponse.json();
        const feedbackData = await feedbackResponse.json();

        setEvents(eventsData);
        setUsers(usersData.users || []);
        setFeedbacks(feedbackData.feedbacks || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Chart Data
  const getUserGrowthData = () => {
    const monthlyData = Array(12).fill(0); // Initialize with zeros for all months
    events.forEach((event) => {
      const month = new Date(event.date).getMonth(); // Get month index (0-11)
      monthlyData[month] += 1;
    });

    return {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Events Created",
          data: monthlyData,
          borderColor: "#4F46E5",
          backgroundColor: "rgba(79, 70, 229, 0.2)",
          pointBorderColor: "#9333EA",
          tension: 0.4,
        },
      ],
    };
  };

  const getEventTypeData = () => {
    const typeData = {};
    events.forEach((event) => {
      typeData[event.type] = (typeData[event.type] || 0) + 1;
    });

    return {
      labels: Object.keys(typeData),
      datasets: [
        {
          data: Object.values(typeData),
          backgroundColor: ["#34D399", "#60A5FA", "#F87171", "#FBBF24"],
        },
      ],
    };
  };

  const getFeedbackData = () => {
    const feedbackCounts = { Positive: 0, Neutral: 0, Negative: 0 };
    feedbacks.forEach((feedback) => {
      if (feedback.rating >= 4) feedbackCounts.Positive += 1;
      else if (feedback.rating === 3) feedbackCounts.Neutral += 1;
      else feedbackCounts.Negative += 1;
    });

    return {
      labels: ["Positive", "Neutral", "Negative"],
      datasets: [
        {
          data: Object.values(feedbackCounts),
          backgroundColor: ["#22C55E", "#FACC15", "#EF4444"],
        },
      ],
    };
  };

  return (
    <div
      className="min-h-screen text-white"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(242, 98, 152, 0.3), rgba(242, 98, 152, 0.7)), url('/images/login_bc.png')`,
        backgroundSize: "cover",
      }}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      ) : (
        <>
          {/* Header Section */}
          <header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-8">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl font-bold mb-2">
                Reports & Analytics 📊
              </h1>
              <p className="text-sm">
                Track growth, analyze user activity, and gather insights.
              </p>
            </div>
          </header>

          {/* Summary Cards */}
          <div className="container mx-auto px-4 mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SummaryCard
              icon={<FaUserFriends />}
              value={users.length}
              label="Total Users"
              color="blue"
            />
            <SummaryCard
              icon={<FaCalendarAlt />}
              value={events.length}
              label="Total Events"
              color="green"
            />
            <SummaryCard
              icon={<FaStar />}
              value={
                feedbacks.length > 0
                  ? (
                      feedbacks.reduce((sum, f) => sum + f.rating, 0) /
                      feedbacks.length
                    ).toFixed(1)
                  : "N/A"
              }
              label="Overall Rating"
              color="purple"
            />
          </div>

          {/* Charts Section */}
          <div className="container mx-auto px-4 mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <ChartCard
              title="Event Growth Over Time"
              chart={<Line data={getUserGrowthData()} />}
            />
            <ChartCard
              title="Events by Type"
              chart={<Pie data={getEventTypeData()} />}
            />
            <ChartCard
              title="Feedback Analysis"
              chart={<Bar data={getFeedbackData()} />}
              className="col-span-2"
            />
          </div>

          {/* Footer Section */}
          <footer className="bg-gray-800 text-white py-6 mt-12">
            <div className="container mx-auto text-center">
              <p>© 2024 EventVerse. All rights reserved.</p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

const SummaryCard = ({ icon, value, label, color }) => (
  <div
    className={`rounded-lg shadow-md bg-${color}-500 text-white p-6 hover:scale-105 transition duration-300`}
  >
    <div className="text-4xl mb-3">{icon}</div>
    <h2 className="text-2xl font-semibold">{value}</h2>
    <p>{label}</p>
  </div>
);

const ChartCard = ({ title, chart, className = "" }) => (
  <div
    className={`bg-white rounded-lg shadow p-6 hover:shadow-lg transition duration-300 ${className}`}
  >
    <h2 className="text-lg font-semibold text-gray-700 mb-4">{title}</h2>
    {chart}
  </div>
);

export default ViewReports;
