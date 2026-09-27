import express from "express";
import morgan from "morgan";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { catchError, HandleERROR } from "vanta-api";

import teacherRouter from "./Routes/teacher.js";
import companyRouter from "./Routes/company.js";
import contractRouter from "./Routes/contract.js";
import financeRecordRouter from "./Routes/financeRecord.js";
import todoRouter from "./Routes/todo.js";
import availableTimeRouter from "./Routes/availableTime.js";
import classTemplateRouter from "./Routes/classTemplate.js";
import dailyClassLogRouter from "./Routes/dailyClassLog.js";
import reportRouter from "./Routes/report.js";
import authRoutes from "./Routes/authRoutes.js";
import generatedClassRouter from "./Routes/generatedClass.js"; // ✅ این خط رو اضافه کن
import notificationRouter from "./Routes/notificationRoute.js";
import invoiceRoute from "./Routes/invoiceRoute.js";
import subscriptionRoute from "./Routes/subscriptionRoute.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "Too many requests from this IP, please try again later."
});

app.use("/api", limiter);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "System Class Management API is running..."
  });
});

app.use("/api/teacher", teacherRouter);
app.use("/api/company", companyRouter);
app.use("/api/contract", contractRouter);
app.use("/api/financeRecord", financeRecordRouter);
app.use("/api/todo", todoRouter);
app.use("/api/availableTime", availableTimeRouter);
app.use("/api/classTemplate", classTemplateRouter);
app.use("/api/dailyClassLog", dailyClassLogRouter);
app.use("/api/report", reportRouter);
app.use("/api/auth", authRoutes);
app.use("/api/generated-class", generatedClassRouter); // ✅ این خط رو اضافه کن
app.use("/api/notifications", notificationRouter);
app.use("/api/invoices", invoiceRoute);

// بعد از بقیه روت‌ها
app.use("/api/subscription", subscriptionRoute);
app.use((req, res, next) => {
  return next(new HandleERROR('Route Not Found', 404));
});

app.use(catchError);

export default app;