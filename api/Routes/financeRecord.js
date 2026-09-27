import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import { uploadReceiptFile } from "../Middleware/uploadFinance.js";
import {
  getAllFinanceRecords,
  getFinanceRecord,
  createFinanceRecord,
  updateFinanceRecord,
  deleteFinanceRecord,
  downloadReceiptFile,
  deleteReceiptFile
} from "../Controllers/financeRecordController.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getAllFinanceRecords)
  .post(uploadReceiptFile, createFinanceRecord);

router.route("/:id")
  .get(getFinanceRecord)
  .put(uploadReceiptFile, updateFinanceRecord)
  .delete(deleteFinanceRecord);

// روت‌های مدیریت فایل
router.get("/:id/download", downloadReceiptFile);
router.delete("/:id/file", deleteReceiptFile);

export default router;