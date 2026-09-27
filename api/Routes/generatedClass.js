import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import {
  getClassesByDate,
  getClassesByDateRange,
  markAttendance,
  markBulkAttendance,
  updateGeneratedClass,
  getClassStats
} from "../Controllers/generatedClassController.js";

const router = express.Router();

router.use(protect);

router.get("/date/:date", getClassesByDate);
router.get("/range", getClassesByDateRange);
router.get("/stats", getClassStats);
router.put("/:id/attendance", markAttendance);
router.post("/bulk-attendance", markBulkAttendance);
router.put("/:id", updateGeneratedClass);

export default router;