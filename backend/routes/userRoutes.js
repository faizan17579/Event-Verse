import express from "express";
import {
  signup,
  login,
  getPreferences,
  updatePreferences,
} from "../controllers/usercontroller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login/:role", login);
router.get("/preferences", getPreferences);
router.put("/preferences", updatePreferences);

export default router;
