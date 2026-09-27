import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import {
  monthlyTeachingReport,
  teachingByCompanyReport,
  monthlyIncomeReport,
  incomeByDateRange,
  companiesWorkedBetween,
  contractsReport,
  classesReport,
  monthlyTeachingRangeReport,
  teachingByCompanyRangeReport
} from "../Controllers/reportController.js";

const reportRouter = express.Router();

reportRouter.use(protect);

// روت‌های قدیمی
reportRouter.get("/monthly-teaching", monthlyTeachingReport);
reportRouter.get("/company-teaching", teachingByCompanyReport);
reportRouter.get("/monthly-income", monthlyIncomeReport);
reportRouter.get("/income-range", incomeByDateRange);
reportRouter.get("/companies-range", companiesWorkedBetween);
reportRouter.get("/contracts", contractsReport);
reportRouter.get("/classes", classesReport);

// روت‌های جدید با بازه زمانی
reportRouter.get("/monthly-teaching-range", monthlyTeachingRangeReport);
reportRouter.get("/company-teaching-range", teachingByCompanyRangeReport);

export default reportRouter;