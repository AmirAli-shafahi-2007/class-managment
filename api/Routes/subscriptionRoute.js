import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import {
  getSubscriptionInfo,
  requestPayment,
  verifyPayment,
  checkExpiredSubscriptions
} from "../Controllers/subscriptionController.js";

const router = express.Router();

// روت تایید پرداخت (بدون نیاز به احراز هویت - کالبک زرین‌پال)
router.get("/verify", verifyPayment);

// همه روت‌های زیر نیاز به احراز هویت دارند
router.use(protect);

router.get("/info", getSubscriptionInfo);
router.post("/request", requestPayment);
router.post("/check-expired", checkExpiredSubscriptions);

export default router;