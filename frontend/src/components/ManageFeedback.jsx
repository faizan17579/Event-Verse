import React, { useState, useEffect } from "react";
import { FaUserAlt, FaRegCommentDots, FaTrash } from "react-icons/fa";

const AllFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllFeedback();
  }, []);

  const fetchAllFeedback = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/feedback/all");
      if (!response.ok) throw new Error("Failed to fetch feedback");

      const data = await response.json();
      setFeedbacks(data.feedbacks);
    } catch (err) {
      setError("Failed to load feedback. Please try again later.");
      console.error("Error fetching feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/feedback/delete/${feedbackId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete feedback");

      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.filter((feedback) => feedback._id !== feedbackId)
      );
      alert("Feedback deleted successfully!");
    } catch (err) {
      console.error("Failed to delete feedback:", err);
      alert("An error occurred while deleting feedback.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div
      className="min-h-screen text-white"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(242, 98, 152, 0.3), rgba(242, 98, 152, 0.7)), url('./images/login_bc.png')`,
        backgroundSize: "cover",
      }}
    >
      <div className="container mx-auto px-6 py-10">
        <h2 className="text-4xl font-bold mb-6 text-yellow-400 text-center">
          All Feedback
        </h2>

        {error && (
          <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              <div
                key={feedback._id}
                className="bg-gray-900 rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:scale-105"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <FaUserAlt className="text-indigo-400 text-4xl" />
                  <div>
                    <p className="font-bold text-lg">
                      {feedback.userId?.name || "Anonymous"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {feedback.userId?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center mt-2 space-x-2">
                  <FaRegCommentDots className="text-yellow-300" />
                  <p>{feedback.comment}</p>
                </div>

                <p className="mt-2">
                  <strong>Rating:</strong> {feedback.rating}
                </p>

                <button
                  onClick={() => handleDeleteFeedback(feedback._id)}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white rounded py-2 px-4 flex items-center justify-center space-x-2"
                >
                  <FaTrash />
                  <span>Delete</span>
                </button>
              </div>
            ))
          ) : (
            <p className="text-center mt-12 text-gray-300">
              No feedback available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllFeedback;
