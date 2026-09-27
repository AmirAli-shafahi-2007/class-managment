import GeneratedClass from "../Models/generatedClassMd.js";
import { catchAsync, HandleERROR } from "vanta-api";
import moment from "moment-jalaali";

// دریافت کلاس‌های یک روز خاص
export const getClassesByDate = catchAsync(async (req, res) => {
  const { date } = req.params;
  
  // تبدیل تاریخ میلادی به شیء Date
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  const endDate = new Date(targetDate);
  endDate.setHours(23, 59, 59, 999);
  
  const classes = await GeneratedClass.find({
    teacher: req.user._id,
    date: { $gte: targetDate, $lte: endDate }
  })
    .populate("company", "name phone")
    .populate("contract", "title hourlyRate")
    .sort({ startTime: 1 });
  
  res.json({
    success: true,
    data: classes,
    results: classes.length
  });
});

// دریافت کلاس‌های بازه زمانی
export const getClassesByDateRange = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  
  const classes = await GeneratedClass.find({
    teacher: req.user._id,
    date: { $gte: start, $lte: end }
  })
    .populate("company", "name")
    .populate("contract", "title")
    .sort({ date: 1, startTime: 1 });
  
  res.json({
    success: true,
    data: classes,
    results: classes.length
  });
});

// ثبت حضور/غیاب یک کلاس
export const markAttendance = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { attended, hoursTaught, notes } = req.body;
  
  const classItem = await GeneratedClass.findOne({
    _id: id,
    teacher: req.user._id
  });
  
  if (!classItem) {
    throw new HandleERROR("کلاس یافت نشد", 404);
  }
  
  // به‌روزرسانی کلاس
  classItem.attended = attended;
  classItem.status = attended ? "attended" : "absent";
  classItem.hoursTaught = attended ? (hoursTaught || 0) : 0;  // ✅ این خط مهمه
  if (notes !== undefined) classItem.notes = notes;
  await classItem.save();
  
  res.json({
    success: true,
    message: attended ? "حضور ثبت شد" : "غیبت ثبت شد",
    data: classItem
  });
});

// ثبت حضور دسته‌جمعی
export const markBulkAttendance = catchAsync(async (req, res) => {
  const { classes } = req.body;
  const results = [];
  
  for (const item of classes) {
    const classItem = await GeneratedClass.findOne({
      _id: item.id,
      teacher: req.user._id
    });
    
    if (classItem) {
      
      // به‌روزرسانی
      classItem.attended = item.attended;
      classItem.status = item.attended ? "attended" : "absent";
      classItem.hoursTaught = item.attended ? (item.hoursTaught || 0) : 0;
      if (item.notes) classItem.notes = item.notes;
      await classItem.save();
      
      
      results.push({
        id: classItem._id,
        title: classItem.title,
        attended: classItem.attended
      });
    }
  }
  
  res.json({
    success: true,
    message: "وضعیت کلاس‌ها ثبت شد",
    data: results
  });
});

// آپدیت کلاس
export const updateGeneratedClass = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { attended, hoursTaught, notes, status } = req.body;
  
  const classItem = await GeneratedClass.findOne({
    _id: id,
    teacher: req.user._id
  });
  
  if (!classItem) {
    throw new HandleERROR("کلاس یافت نشد", 404);
  }
  
  
  // به‌روزرسانی
  classItem.attended = attended;
  classItem.status = status || (attended ? "attended" : "absent");
  classItem.hoursTaught = attended ? (hoursTaught || 0) : 0;
  if (notes !== undefined) classItem.notes = notes;
  await classItem.save();
  
  
  const updatedClass = await GeneratedClass.findById(id)
    .populate("company", "name")
    .populate("contract", "title");
  
  res.json({
    success: true,
    message: "کلاس با موفقیت به‌روزرسانی شد",
    data: updatedClass
  });
});

// آمار کلاس‌ها
export const getClassStats = catchAsync(async (req, res) => {
  const { startDate, endDate, period } = req.query;
  
  const matchQuery = { teacher: req.user._id };
  
  if (startDate && endDate) {
    matchQuery.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  
  const stats = await GeneratedClass.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalHours: { $sum: "$hoursTaught" }
      }
    }
  ]);
  
  const totalClasses = stats.reduce((sum, s) => sum + s.count, 0);
  const attendedClasses = stats.find(s => s._id === "attended")?.count || 0;
  const absentClasses = stats.find(s => s._id === "absent")?.count || 0;
  const pendingClasses = stats.find(s => s._id === "pending")?.count || 0;
  const totalHours = stats.reduce((sum, s) => sum + (s.totalHours || 0), 0);
  
  // آمار ماهانه (اختیاری)
  let monthlyStats = [];
  if (period === "monthly") {
    monthlyStats = await GeneratedClass.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          attended: { $sum: { $cond: [{ $eq: ["$status", "attended"] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } },
          totalHours: { $sum: "$hoursTaught" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);
  }
  
  res.json({
    success: true,
    data: {
      summary: {
        totalClasses,
        attendedClasses,
        absentClasses,
        pendingClasses,
        totalHours,
        attendanceRate: totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0
      },
      details: stats,
      monthlyStats
    }
  });
});