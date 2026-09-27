import { catchAsync, HandleERROR } from "vanta-api";
import DailyClassLog from "../Models/dailyClassLogMd.js";
import ClassTemplate from "../Models/classTemplateMd.js";
import { assertContractOwned, assertTemplateOwned } from "../Utils/ownership.js";

// دریافت همه کلاس لگ‌ها
export const getAllClassLogs = catchAsync(async (req, res, next) => {
  const logs = await DailyClassLog.find({ teacher: req.user._id })
    .populate({ path: "teacher", select: "username" })
    .populate({ path: "classTemplate", select: "title company" })
    .populate({ path: "contract", select: "title hourlyRate" })
    .sort({ date: -1 });

  return res.status(200).json({
    data: logs,
    results: logs.length,
  });
});

// دریافت یک کلاس لگ
export const getClassLog = catchAsync(async (req, res, next) => {
  const log = await DailyClassLog.findOne({
    _id: req.params.id,
    teacher: req.user._id,
  })
    .populate({ path: "teacher", select: "username" })
    .populate({ path: "classTemplate", select: "title company dayOfWeek startTime endTime" })
    .populate({ path: "contract", select: "title hourlyRate" });

  if (!log) {
    return next(new HandleERROR("Class log not found", 404));
  }

  return res.status(200).json({
    success: true,
    data: [log],
    results: 1,
  });
});

// ایجاد کلاس لگ جدید
export const createClassLog = catchAsync(async (req, res, next) => {
  req.body.teacher = req.user._id;

  // تمپلیت و قرارداد باید متعلق به همین کاربر باشند
  await assertTemplateOwned(req.body.classTemplate, req.user._id);
  await assertContractOwned(req.body.contract, req.user._id);

  // پیدا کردن قرارداد از طریق کلاس تمپلیت
  if (req.body.classTemplate && !req.body.contract) {
    const classTemplate = await ClassTemplate.findOne({
      _id: req.body.classTemplate,
      teacher: req.user._id,
    });
    if (classTemplate && classTemplate.contract) {
      req.body.contract = classTemplate.contract;
    }
  }

  const classLog = await DailyClassLog.create(req.body);

  return res.status(201).json({
    message: "Class log created successfully",
    data: classLog,
    success: true,
  });
});

// ویرایش کلاس لگ
export const updateClassLog = catchAsync(async (req, res, next) => {
  // جلوگیری از انتقال رکورد به کاربر دیگر
  const { teacher, _id, ...data } = req.body;

  await assertTemplateOwned(data.classTemplate, req.user._id);
  await assertContractOwned(data.contract, req.user._id);

  const classLog = await DailyClassLog.findOneAndUpdate(
    { _id: req.params.id, teacher: req.user._id },
    data,
    { new: true, runValidators: true }
  );

  if (!classLog) {
    return next(new HandleERROR("Class log not found", 404));
  }

  return res.status(200).json({
    message: "Class log updated successfully",
    data: classLog,
    success: true,
  });
});

// حذف کلاس لگ
export const deleteClassLog = catchAsync(async (req, res, next) => {
  const classLog = await DailyClassLog.findOneAndDelete({
    _id: req.params.id,
    teacher: req.user._id,
  });

  if (!classLog) {
    return next(new HandleERROR("Class log not found", 404));
  }

  return res.status(200).json({
    message: "Class log deleted successfully",
    success: true,
  });
});

// آمار کلاس لگ‌ها برای یک قرارداد خاص
export const getClassLogsByContract = catchAsync(async (req, res, next) => {
  const { contractId } = req.params;

  const logs = await DailyClassLog.find({
    contract: contractId,
    teacher: req.user._id,
  })
    .populate({ path: "classTemplate", select: "title" })
    .sort({ date: -1 });

  const totalHours = logs.reduce((sum, log) => sum + (log.hoursTaught || 0), 0);
  const attendedCount = logs.filter((log) => log.attended).length;
  const absentCount = logs.filter((log) => !log.attended).length;

  return res.status(200).json({
    success: true,
    data: {
      logs,
      summary: {
        totalClasses: logs.length,
        attendedClasses: attendedCount,
        absentClasses: absentCount,
        totalHoursTaught: totalHours,
      },
    },
  });
});