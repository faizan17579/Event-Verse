import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
