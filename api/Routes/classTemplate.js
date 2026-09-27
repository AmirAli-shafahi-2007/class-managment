import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import {
  getAllClassTemplates,
  createClassTemplate,
  updateClassTemplate,
  deleteClassTemplate,
  getClassesByDate,
  markAttendance,
  getClassStats
} from "../Controllers/classTemplateController.js";

const router = express.Router();

router.use(protect);

// تمپلیت‌ها
router.get("/", getAllClassTemplates);
router.post("/", createClassTemplate);
router.put("/:id", updateClassTemplate);
router.delete("/:id", deleteClassTemplate);

// کلاس‌های تولید شده
router.get("/classes/date/:date", getClassesByDate);
router.put("/classes/:id/attendance", markAttendance);
router.get("/stats", getClassStats);

export default router;