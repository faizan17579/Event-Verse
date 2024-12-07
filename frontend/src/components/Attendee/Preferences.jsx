import React, { useState } from "react";
import { FaMusic, FaFutbol, FaBuilding, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const InterestsForm = ({}) => {
  const user = localStorage.getItem("user");

  const userObj = JSON.parse(user); // Parse the JSON string
  const email = userObj.email;

  const [selectedInterests, setSelectedInterests] = useState({
    music: [],
    sport: [],
    business: [],
    exhibition: [],
  });

  const [message, setMessage] = useState("");
  //get navigate
  const navigate = useNavigate();

  const handleSelect = (category, interest) => {
    setSelectedInterests((prevState) => {
      const newCategory = prevState[category].includes(interest)
        ? prevState[category].filter((item) => item !== interest)
        : [...prevState[category], interest];
      return { ...prevState, [category]: newCategory };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create an array of objects for preferences
    const preferences = [
      {
        music: selectedInterests.music || [],
        sport: selectedInterests.sport || [],
        business: selectedInterests.business || [],
        exhibition: selectedInterests.exhibition || [],
      },
    ];

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/preferences",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, preferences }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Preferences saved successfully!");
        //go to login page
      } else {
        setMessage(
          data.message || "An error occurred while saving preferences."
        );
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      setMessage("An error occurred. Please try again.");
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
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Side */}
          <div className="flex flex-col justify-center items-start space-y-6">
            <h1 className="text-4xl font-bold text-yellow-300">Tell Us</h1>
            <h2 className="text-3xl font-extrabold text-white animate-bounce">
              What Are Your Interests?
            </h2>
            <p className="text-lg max-w-lg">
              Select your areas of interest, and we’ll tailor your experience.
            </p>
            <p className="text-lg">What is your preferred location?</p>
          </div>

          {/* Right Side Content (Cards) */}
          <div>
            <div className="bg-white text-black p-6 rounded-lg shadow-lg mb-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <FaMusic className="mr-2 text-purple-500" /> Music
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Blues & Jazz", "EDM", "Hip Hop", "Rap", "Pop", "R&B"].map(
                  (genre) => (
                    <button
                      key={genre}
                      className={`py-2 px-4 rounded-full ${
                        selectedInterests.music.includes(genre)
                          ? "bg-purple-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-purple-500 hover:text-white"
                      }`}
                      onClick={() => handleSelect("music", genre)}
                    >
                      {genre}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="bg-white text-black p-6 rounded-lg shadow-lg mb-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <FaFutbol className="mr-2 text-green-500" /> Sport
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Football",
                  "Basketball",
                  "Tennis",
                  "Swimming",
                  "Volleyball",
                ].map((sport) => (
                  <button
                    key={sport}
                    className={`py-2 px-4 rounded-full ${
                      selectedInterests.sport.includes(sport)
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white"
                    }`}
                    onClick={() => handleSelect("sport", sport)}
                  >
                    {sport}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white text-black p-6 rounded-lg shadow-lg mb-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <FaBuilding className="mr-2 text-yellow-500" /> Business
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Trade Shows", "Product Launches", "Business Seminars"].map(
                  (business) => (
                    <button
                      key={business}
                      className={`py-2 px-4 rounded-full ${
                        selectedInterests.business.includes(business)
                          ? "bg-yellow-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-yellow-500 hover:text-white"
                      }`}
                      onClick={() => handleSelect("business", business)}
                    >
                      {business}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="bg-white text-black p-6 rounded-lg shadow-lg mb-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" /> Exhibition
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Exhibitions", "Trade Shows", "Product Launches"].map(
                  (exhibition) => (
                    <button
                      key={exhibition}
                      className={`py-2 px-4 rounded-full ${
                        selectedInterests.exhibition.includes(exhibition)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
                      }`}
                      onClick={() => handleSelect("exhibition", exhibition)}
                    >
                      {exhibition}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save Preferences Button */}
        <div className="text-center mt-10">
          <button
            type="button"
            className="bg-pink-600 text-white py-3 px-10 rounded-lg hover:bg-pink-700 transition"
            onClick={handleSubmit}
          >
            Save Preferences
          </button>
        </div>

        {/* Displaying Status Message */}
        {message && (
          <p className="text-center mt-4 text-lg text-white">{message}</p>
        )}
      </div>
    </div>
  );
};

export default InterestsForm;
