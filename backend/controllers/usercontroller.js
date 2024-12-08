import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Save or update user profile
export const saveUserProfile = async (req, res) => {
  const { name, email, role, organizationName, phone, experienceLevel } =
    req.body;

  try {
    // Find the user by their email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's profile information
    if (name) user.name = name;
    if (role) user.role = role;
    if (organizationName) user.organizationName = organizationName;
    if (phone) user.phone = phone;
    if (experienceLevel) user.experienceLevel = experienceLevel;

    // Save the updated user data to the database
    await user.save();

    // Send a success response
    res
      .status(200)
      .json({ message: "User profile updated successfully", user });
  } catch (error) {
    console.error("Error saving user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Retrieve user profile by ID
export const getUserProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    // Validate the user ID
    if (!userId || userId === "undefined") {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Find the user by their ID
    const user = await User.findById(userId);

    // If the user is not found, return a 404 response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's profile
    res.status(200).json({
      message: "User profile retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, us: user }, process.env.JWT_SECRET, {
    expiresIn: "1hr",
  });
};

// Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login
export const login = async (req, res) => {
  const { role } = req.params;
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get preferences
export const getPreferences = async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({ email, role: "Attendee" });
    if (!user) {
      return res.status(404).json({ message: "Attendee not found" });
    }

    res.status(200).json({ preferences: user.preferences });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update preferences
export const updatePreferences = async (req, res) => {
  const { email, preferences } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { email, role: "Attendee" },
      { $set: { preferences } },
      { new: true }
    );

    if (user) {
      res.json({ message: "Preferences updated successfully!" });
    } else {
      res.status(404).json({ message: "User not found or incorrect role" });
    }
  } catch (error) {
    console.error("Error saving preferences:", error);
    res.status(500).json({ message: "Error saving preferences" });
  }
};

// Delete User by ID
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find and delete the user by ID
    const user = await User.findByIdAndDelete(userId);

    if (user) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "Internal server error", details: error.message });
  }
};
// Get all users
export const getAllUsers = async (req, res) => {
  try {
    // want to not select the user with role "Admin"
    const users = await User.find({ role: { $ne: "Admin" } });

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ message: "Internal server error", details: error.message });
  }
};
