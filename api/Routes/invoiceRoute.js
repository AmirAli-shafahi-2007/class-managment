import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import {
  getAllInvoices,
  getInvoicesByCompany,
  getInvoice,
  generateMonthlyInvoice,
  getCurrentDebt,
  debugMonthlyClasses
} from "../Controllers/invoiceController.js";

const router = express.Router();

router.use(protect);

router.get("/", getAllInvoices);
router.get("/debt", getCurrentDebt);
router.get("/company/:companyId", getInvoicesByCompany);
router.get("/:id", getInvoice);
router.post("/generate", generateMonthlyInvoice);
router.get("/debug/classes", debugMonthlyClasses);

export default router;