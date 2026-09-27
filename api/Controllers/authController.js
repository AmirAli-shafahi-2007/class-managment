import bcrypt from "bcryptjs";
import Teacher from "../Models/teacherMd.js";
import { generateToken } from "../Utils/generateToken.js";

// مدت دوره‌ی آزمایشی رایگان برای کاربران جدید (روز)
const TRIAL_DAYS = 14;

// ─── تابع ثبت نام ─────
export const register = async (req, res) => {
  try {
    const { name, username, phone, password } = req.body;

    if (!name || !username || !phone || !password)
      return res.status(400).json({ message: "همه موارد الزامی است" });

    const exists = await Teacher.findOne({ username });
    if (exists) return res.status(400).json({ message: "نام کاربری تکراری است" });

    const phoneExists = await Teacher.findOne({ phone });
    if (phoneExists) return res.status(400).json({ message: "این شماره موبایل قبلاً ثبت شده است" });

    const hashedPass = await bcrypt.hash(password, 10);

    // دوره‌ی آزمایشی: دسترسی کامل (pro) برای TRIAL_DAYS روز، بدون نیاز به پرداخت
    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(trialEnd.getDate() + TRIAL_DAYS);

    const teacher = await Teacher.create({
      name,
      username,
      phone,
      password: hashedPass,
      role: "teacher",
      subscription: {
        plan: "pro",
        status: "active",
        startDate: now,
        endDate: trialEnd,
        paymentId: null,
      },
    });

    res.json({
      user: {
        _id: teacher._id,       // ✅ تغییر از id به _id
        name: teacher.name,
        username: teacher.username,
      },
      token: generateToken(teacher._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const teacher = await Teacher.findOne({ username });

    if (!teacher)
      return res.status(400).json({ message: "Invalid username or password" });

    const isMatch = await bcrypt.compare(password, teacher.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid username or password" });

    res.json({
      message: "Login successful",
      user: {
        _id: teacher._id,       // ✅ تغییر از id به _id
        name: teacher.name,
        username: teacher.username
      },
      token: generateToken(teacher._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};