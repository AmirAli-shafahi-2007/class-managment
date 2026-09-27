import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import { getNotifications, markAsRead, markAllAsRead } from "../Controllers/notificationController.js";

const router = express.Router();

router.use(protect);

router.get("/", getNotifications);
router.put("/:notificationId/read", markAsRead);
router.put("/read-all", markAllAsRead);

export default router;