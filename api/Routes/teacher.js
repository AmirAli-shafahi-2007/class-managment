import { Router } from "express";
import { protect, restrictTo } from "../Middleware/authMiddleware.js";
import {
  getMe,
  updateMe,
  getAllTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher
} from "../Controllers/teacherController.js";

const teacherRouter = Router();

// همه روت‌ها نیاز به لاگین دارند
teacherRouter.use(protect);

// ─── کاربر عادی: فقط پروفایل خودش ───
// (باید قبل از "/:id" تعریف شوند تا "me" به‌عنوان id تفسیر نشود)
teacherRouter.route("/me").get(getMe).put(updateMe);

// ─── فقط ادمین ───
teacherRouter.use(restrictTo("admin"));

teacherRouter
  .route("/")
  .get(getAllTeachers)
  .post(createTeacher);

teacherRouter
  .route("/:id")
  .get(getTeacher)
  .put(updateTeacher)
  .delete(deleteTeacher);

export default teacherRouter;