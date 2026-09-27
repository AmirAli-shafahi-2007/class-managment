import ClassTemplate from "../Models/classTemplateMd.js";
import GeneratedClass from "../Models/generatedClassMd.js";
import { catchAsync, HandleERROR } from "vanta-api";
import { assertCompanyOwned, assertContractOwned } from "../Utils/ownership.js";

// تابع ساده برای تولید کلاس‌ها
async function generateClasses(template, teacherId) {
  try {
    const classes = [];
    const start = new Date(template.startDate);
    const end = new Date(template.endDate);

    const dayMap = {
      "saturday": 6, "sunday": 0, "monday": 1, "tuesday": 2,
      "wednesday": 3, "thursday": 4, "friday": 5
    };

    const targetDays = template.daysOfWeek.map(d => dayMap[d]);

    let current = new Date(start);

    while (current <= end) {
      const dayIndex = current.getDay();

      if (targetDays.includes(dayIndex)) {
        const dayName = Object.keys(dayMap).find(key => dayMap[key] === dayIndex);

        classes.push({
          teacher: teacherId,
          classTemplate: template._id,
          company: template.company,
          contract: template.contract,
          title: template.title,
          date: new Date(current),
          dayOfWeek: dayName,
          startTime: template.startTime,
          endTime: template.endTime,
          hoursTaught: 0,
          status: "pending",
          attended: false,
          notes: ""
        });
      }
      current.setDate(current.getDate() + 1);
    }

    if (classes.length > 0) {
      await GeneratedClass.insertMany(classes);
      console.log(`✅ ${classes.length} کلاس جدید ساخته شد`);
    }

    return classes.length;
  } catch (error) {
    console.error("❌ خطا در تولید کلاس:", error);
    return 0;
  }
}

// دریافت همه تمپلیت‌ها
export const getAllClassTemplates = catchAsync(async (req, res) => {
  const templates = await ClassTemplate.find({ teacher: req.user._id })
    .populate("company", "name")
    .populate("contract", "title hourlyRate")
    .sort({ createdAt: -1 });

  res.json({ data: templates, results: templates.length });
});

// ایجاد تمپلیت جدید
export const createClassTemplate = catchAsync(async (req, res) => {
  req.body.teacher = req.user._id;

  // شرکت و قرارداد باید متعلق به همین کاربر باشند
  await assertCompanyOwned(req.body.company, req.user._id);
  await assertContractOwned(req.body.contract, req.user._id);

  const template = await ClassTemplate.create(req.body);

  // تولید کلاس‌ها
  const generatedCount = await generateClasses(template, req.user._id);

  res.status(201).json({
    success: true,
    message: "الگوی کلاس ایجاد شد",
    data: template,
    generatedClasses: generatedCount
  });
});

// ویرایش تمپلیت
export const updateClassTemplate = catchAsync(async (req, res) => {
  // جلوگیری از انتقال تمپلیت به کاربر دیگر
  const { teacher, _id, ...data } = req.body;

  // ✅ اول مالکیت چک می‌شود؛ قبلاً کلاس‌های تولیدشده قبل از هر چکی پاک می‌شدند
  const existing = await ClassTemplate.findOne({ _id: req.params.id, teacher: req.user._id });
  if (!existing) {
    throw new HandleERROR("تمپلیت یافت نشد", 404);
  }

  await assertCompanyOwned(data.company, req.user._id);
  await assertContractOwned(data.contract, req.user._id);

  // حذف کلاس‌های قبلی
  await GeneratedClass.deleteMany({ classTemplate: req.params.id, teacher: req.user._id });

  const template = await ClassTemplate.findOneAndUpdate(
    { _id: req.params.id, teacher: req.user._id },
    data,
    { new: true }
  );

  // تولید مجدد کلاس‌ها
  const generatedCount = await generateClasses(template, req.user._id);

  res.json({
    success: true,
    message: "الگوی کلاس به‌روزرسانی شد",
    data: template,
    generatedClasses: generatedCount
  });
});

// حذف تمپلیت
export const deleteClassTemplate = catchAsync(async (req, res) => {
  // ✅ اول تمپلیتِ متعلق به خود کاربر حذف می‌شود؛ فقط اگر وجود داشت کلاس‌هایش پاک می‌شوند
  const template = await ClassTemplate.findOneAndDelete({
    _id: req.params.id,
    teacher: req.user._id
  });

  if (!template) {
    throw new HandleERROR("تمپلیت یافت نشد", 404);
  }

  await GeneratedClass.deleteMany({ classTemplate: req.params.id, teacher: req.user._id });

  res.json({ success: true, message: "الگوی کلاس حذف شد" });
});

// دریافت کلاس‌های یک تاریخ
export const getClassesByDate = catchAsync(async (req, res) => {
  const { date } = req.params;

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const classes = await GeneratedClass.find({
    teacher: req.user._id,
    date: { $gte: start, $lte: end }
  })
    .populate("company", "name")
    .populate("contract", "title")
    .sort({ startTime: 1 });

  res.json({ success: true, data: classes, results: classes.length });
});

// ثبت حضور/غیاب
export const markAttendance = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { attended, hoursTaught, notes } = req.body;

  const classItem = await GeneratedClass.findOneAndUpdate(
    { _id: id, teacher: req.user._id },
    {
      attended: attended,
      status: attended ? "attended" : "absent",
      hoursTaught: attended ? hoursTaught : 0,
      notes: notes || ""
    },
    { new: true }
  );

  if (!classItem) {
    throw new HandleERROR("کلاس یافت نشد", 404);
  }

  res.json({ success: true, data: classItem });
});

// آمار کلاس‌ها
export const getClassStats = catchAsync(async (req, res) => {
  const stats = await GeneratedClass.aggregate([
    { $match: { teacher: req.user._id } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalHours: { $sum: "$hoursTaught" }
      }
    }
  ]);

  const totalClasses = stats.reduce((s, item) => s + item.count, 0);
  const attendedClasses = stats.find(s => s._id === "attended")?.count || 0;
  const absentClasses = stats.find(s => s._id === "absent")?.count || 0;
  const pendingClasses = stats.find(s => s._id === "pending")?.count || 0;
  const totalHours = stats.reduce((s, item) => s + (item.totalHours || 0), 0);

  res.json({
    success: true,
    data: {
      summary: { totalClasses, attendedClasses, absentClasses, pendingClasses, totalHours },
      details: stats
    }
  });
});