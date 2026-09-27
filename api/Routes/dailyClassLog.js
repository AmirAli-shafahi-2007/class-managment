import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import {
  getAllClassLogs,
  getClassLog,
  createClassLog,
  updateClassLog,
  deleteClassLog,
  getClassLogsByContract
} from "../Controllers/dailyClassLogController.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getAllClassLogs)
  .post(createClassLog);

router.route("/:id")
  .get(getClassLog)
  .put(updateClassLog)
  .delete(deleteClassLog);

// روت جدید: گرفتن کلاس لگ‌های یک قرارداد خاص
router.get("/contract/:contractId", getClassLogsByContract);

export default router;