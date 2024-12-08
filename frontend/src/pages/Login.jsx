import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Attendee");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/login/${role}`,
        { email, password }
      );
      setMessage(response.data.message);

      // Assuming the response contains user data (including role)
      const user = response.data.user;

      const token = response.data.token;

      // Save user data to localStorage (or context) for later use
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      // Navigate to the appropriate dashboard based on role
      if (user.role === "Attendee") {
        navigate("/dashboard/attendee");
      } else if (user.role === "Organizer") {
        navigate("/dashboard/organizer");
      } else if (user.role === "Admin") {
        navigate("/dashboard/admin");
      } else if (user.role === "Sponsor") {
        navigate("/dashboard/vendor");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div
      className=" min-h-screen flex justify-center items-center"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(242, 98, 152, 0.3), rgba(242, 98, 152, 0.7)), url('./images/login_bc.png')`,
        backgroundSize: "cover",
      }}
    >
      {/* Login Form */}
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-purple-600 mb-8 animate__animated animate__fadeIn">
          Login to EventVerse
        </h2>

        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label
              className="block text-lg font-semibold text-gray-700 mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:border-purple-600 transition duration-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-lg font-semibold text-gray-700 mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:border-purple-600 transition duration-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-lg font-semibold text-gray-700 mb-2"
              htmlFor="role"
            >
              Select Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:border-purple-600 transition duration-300"
            >
              <option value="Attendee">Attendee</option>
              <option value="Organizer">Organizer</option>
              <option value="Admin">Admin</option>
              <option value="Sponsor">Sponsor</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-full text-xl font-semibold shadow-lg transition duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-purple-600 hover:text-purple-700 transition duration-300"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
