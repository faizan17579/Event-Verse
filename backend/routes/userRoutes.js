import express from "express";
import {
  signup,
  login,
  getPreferences,
  updatePreferences,
  deleteUser,
  getAllUsers,
  saveUserProfile,
  getUserProfile,
} from "../controllers/usercontroller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login/:role", login);
router.get("/preferences", getPreferences);
router.put("/preferences", updatePreferences);
router.delete("/delete/:userId", deleteUser);
router.get("/all", getAllUsers);
router.put("/profile", saveUserProfile);
router.get("/profile/:id", getUserProfile);

export default router;
