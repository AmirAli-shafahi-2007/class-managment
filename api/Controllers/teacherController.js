import bcrypt from "bcryptjs";
import { catchAsync, HandleERROR } from "vanta-api";
import Teacher from "../Models/teacherMd.js";

// فیلدهایی که کاربر عادی اجازه ویرایش آن‌ها را روی پروفایل خودش دارد
// (عمداً role و subscription اینجا نیست)
const SELF_EDITABLE_FIELDS = [
  "name",
  "email",
  "phone",
  "specialization",
  "notes",
  "settings",
  "password",
];

// فیلدهایی که ادمین می‌تواند ست کند
const ADMIN_EDITABLE_FIELDS = [
  ...SELF_EDITABLE_FIELDS,
  "username",
  "role",
  "subscription",
];

const pick = (obj, fields) =>
  fields.reduce((acc, key) => {
    if (obj[key] !== undefined) acc[key] = obj[key];
    return acc;
  }, {});

// اگر پسورد ارسال شده بود، هش شود (و اگر خالی بود نادیده گرفته شود)
const preparePassword = async (data) => {
  if (data.password) {
    data.password = await bcrypt.hash(String(data.password), 10);
  } else {
    delete data.password;
  }
  return data;
};

// ─────────────── پروفایل خود کاربر ───────────────

export const getMe = catchAsync(async (req, res) => {
  // req.user در protect بدون password لود شده است
  return res.status(200).json({ success: true, data: req.user });
});

export const updateMe = catchAsync(async (req, res, next) => {
  const data = await preparePassword(pick(req.body, SELF_EDITABLE_FIELDS));

  const teacher = await Teacher.findByIdAndUpdate(req.user._id, data, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!teacher) {
    return next(new HandleERROR("Teacher not found", 404));
  }

  return res.status(200).json({
    message: "Profile updated successfully",
    data: teacher,
    success: true,
  });
});

// ─────────────── مخصوص ادمین ───────────────

export const getAllTeachers = catchAsync(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);

  const [teachers, total] = await Promise.all([
    Teacher.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Teacher.countDocuments(),
  ]);

  return res.status(200).json({
    success: true,
    data: teachers,
    results: teachers.length,
    total,
    page,
  });
});

export const getTeacher = catchAsync(async (req, res, next) => {
  const teacher = await Teacher.findById(req.params.id).select("-password");

  if (!teacher) {
    return next(new HandleERROR("Teacher not found", 404));
  }

  return res.status(200).json({ success: true, data: teacher });
});

export const createTeacher = catchAsync(async (req, res, next) => {
  const data = pick(req.body, ADMIN_EDITABLE_FIELDS);

  if (!data.password) {
    return next(new HandleERROR("Password is required", 400));
  }
  data.password = await bcrypt.hash(String(data.password), 10);

  const teacher = await Teacher.create(data);

  // پسورد هش‌شده در پاسخ برنگردد
  const safe = teacher.toObject();
  delete safe.password;

  return res.status(201).json({
    message: "Teacher created successfully",
    data: safe,
    success: true,
  });
});

export const updateTeacher = catchAsync(async (req, res, next) => {
  const data = await preparePassword(pick(req.body, ADMIN_EDITABLE_FIELDS));

  const teacher = await Teacher.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!teacher) {
    return next(new HandleERROR("Teacher not found", 404));
  }

  return res.status(200).json({
    message: "Teacher updated successfully",
    data: teacher,
    success: true,
  });
});

export const deleteTeacher = catchAsync(async (req, res, next) => {
  // جلوگیری از حذف اتفاقی خود ادمین
  if (String(req.params.id) === String(req.user._id)) {
    return next(new HandleERROR("امکان حذف حساب خودتان وجود ندارد", 400));
  }

  const teacher = await Teacher.findByIdAndDelete(req.params.id);

  if (!teacher) {
    return next(new HandleERROR("Teacher not found", 404));
  }

  return res.status(200).json({
    message: "Teacher deleted successfully",
    success: true,
  });
});