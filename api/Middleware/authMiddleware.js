import jwt from "jsonwebtoken";
import Teacher from "../Models/teacherMd.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const teacher = await Teacher.findById(decoded.id).select("-password");

    if (!teacher)
      return res.status(401).json({ message: "User not found" });

    req.user = teacher;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// فقط نقش‌های مشخص اجازه عبور دارند (بعد از protect استفاده شود)
// مثال: router.use(protect, restrictTo("admin"))
export const restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "شما دسترسی لازم برای این عملیات را ندارید" });
  }
  next();
};