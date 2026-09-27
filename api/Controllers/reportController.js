import DailyClassLog from "../Models/dailyClassLogMd.js";
import FinanceRecord from "../Models/financeRecordMd.js";
import ClassTemplate from "../Models/classTemplateMd.js";
import Company from "../Models/companyMd.js";
import Contract from "../Models/contractMd.js";
import GeneratedClass from "../Models/generatedClassMd.js";
import mongoose from "mongoose";
import { catchAsync } from "vanta-api";
import moment from "moment-jalaali";

/* ================================
   Monthly Teaching Report
================================ */
export const monthlyTeachingReport = async (req, res) => {
  const { year, month, companyId } = req.query;
  
  // تبدیل سال و ماه شمسی به میلادی
  const startDate = moment(`${year}/${month}/01`, "jYYYY/jMM/jDD").startOf("month").toDate();
  const endDate = moment(`${year}/${month}/01`, "jYYYY/jMM/jDD").endOf("month").toDate();

  let matchQuery = {
    teacher: req.user._id,
    date: { $gte: startDate, $lte: endDate },
    attended: true,
    status: "attended"
  };

  if (companyId) {
    matchQuery.company = new mongoose.Types.ObjectId(companyId);
  }

  const classes = await GeneratedClass.find(matchQuery);
  
  const totalHours = classes.reduce((sum, c) => sum + (c.hoursTaught || 0), 0);
  const totalClasses = classes.length;

  // چارت روزانه
  const dailyMap = new Map();
  classes.forEach(c => {
    const dateKey = moment(c.date).format("YYYY-MM-DD");
    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, { hours: 0, classes: 0 });
    }
    const existing = dailyMap.get(dateKey);
    existing.hours += c.hoursTaught || 0;
    existing.classes += 1;
  });

  const chartData = {
    labels: Array.from(dailyMap.keys()),
    datasets: [
      { label: "Hours Taught", data: Array.from(dailyMap.values()).map(v => v.hours) },
      { label: "Number of Classes", data: Array.from(dailyMap.values()).map(v => v.classes) }
    ]
  };

  res.json({ 
    success: true, 
    data: [{ totalHours, totalClasses }],
    chart: chartData,
    filters: { year, month, companyId: companyId || null }
  });
};
// گزارش ماهانه با بازه زمانی
export const monthlyTeachingRangeReport = async (req, res) => {
  const { startDate, endDate, companyId } = req.query;
  
  let matchQuery = {
    teacher: req.user._id,
    date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    attended: true,
    status: "attended"
  };

  if (companyId) {
    matchQuery.company = new mongoose.Types.ObjectId(companyId);
  }

  const classes = await GeneratedClass.find(matchQuery);
  
  const totalHours = classes.reduce((sum, c) => sum + (c.hoursTaught || 0), 0);
  const totalClasses = classes.length;

  // چارت روزانه
  const dailyMap = new Map();
  classes.forEach(c => {
    const dateKey = moment(c.date).format("YYYY-MM-DD");
    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, { hours: 0, classes: 0 });
    }
    const existing = dailyMap.get(dateKey);
    existing.hours += c.hoursTaught || 0;
    existing.classes += 1;
  });

  const chartData = {
    labels: Array.from(dailyMap.keys()),
    datasets: [
      { label: "Hours Taught", data: Array.from(dailyMap.values()).map(v => v.hours) },
      { label: "Number of Classes", data: Array.from(dailyMap.values()).map(v => v.classes) }
    ]
  };

  res.json({ 
    success: true, 
    data: [{ totalHours, totalClasses }],
    chart: chartData
  });
};
/* ================================
   Monthly Teaching Report با بازه زمانی
================================ */


/* ================================
   Teaching By Company Report با بازه زمانی
================================ */
export const teachingByCompanyRangeReport = async (req, res) => {
  try {
    const { startDate, endDate, companyId } = req.query;
    
    console.log("teachingByCompanyRangeReport called:", { startDate, endDate, companyId });
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "startDate and endDate are required"
      });
    }
    
    let matchQuery = {
      teacher: req.user._id,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      attended: true,
      status: "attended"
    };
    
    if (companyId && mongoose.Types.ObjectId.isValid(companyId)) {
      matchQuery.company = new mongoose.Types.ObjectId(companyId);
    }
    
    const classes = await GeneratedClass.find(matchQuery)
      .populate("company", "name");
    
    // گروه‌بندی بر اساس شرکت
    const companyMap = new Map();
    classes.forEach(c => {
      const companyName = c.company?.name || "بدون شرکت";
      if (!companyMap.has(companyName)) {
        companyMap.set(companyName, { 
          _id: companyName, 
          totalHours: 0, 
          totalClasses: 0,
          companyId: c.company?._id 
        });
      }
      const existing = companyMap.get(companyName);
      existing.totalHours += c.hoursTaught || 0;
      existing.totalClasses += 1;
    });
    
    const report = Array.from(companyMap.values());
    
    const chartData = {
      labels: report.map(item => item._id),
      datasets: [
        { label: "ساعت تدریس", data: report.map(item => item.totalHours), backgroundColor: "rgba(54, 162, 235, 0.6)" },
        { label: "تعداد کلاس", data: report.map(item => item.totalClasses), backgroundColor: "rgba(255, 99, 132, 0.6)" }
      ]
    };
    
    res.json({ 
      success: true, 
      data: report,
      chart: chartData
    });
  } catch (error) {
    console.error("Error in teachingByCompanyRangeReport:", error);
    res.status(500).json({
      success: false,
      message: "خطا در دریافت گزارش",
      error: error.message
    });
  }
};
/* ================================
   Teaching By Company Report
================================ */
export const teachingByCompanyReport = async (req, res) => {
  const { companyId } = req.query;

  let matchQuery = {
    teacher: req.user._id,
    attended: true,
    status: "attended"
  };

  if (companyId) {
    matchQuery.company = new mongoose.Types.ObjectId(companyId);
  }

  const classes = await GeneratedClass.find(matchQuery)
    .populate("company", "name");

  // گروه‌بندی بر اساس شرکت
  const companyMap = new Map();
  classes.forEach(c => {
    const companyName = c.company?.name || "بدون شرکت";
    if (!companyMap.has(companyName)) {
      companyMap.set(companyName, { 
        _id: companyName, 
        totalHours: 0, 
        totalClasses: 0,
        companyId: c.company?._id 
      });
    }
    const existing = companyMap.get(companyName);
    existing.totalHours += c.hoursTaught || 0;
    existing.totalClasses += 1;
  });

  const report = Array.from(companyMap.values());

  const chartData = {
    labels: report.map(item => item._id),
    datasets: [
      { label: "Total Hours", data: report.map(item => item.totalHours), backgroundColor: "rgba(54, 162, 235, 0.6)" },
      { label: "Total Classes", data: report.map(item => item.totalClasses), backgroundColor: "rgba(255, 99, 132, 0.6)" }
    ]
  };

  res.json({ 
    success: true, 
    data: report,
    chart: chartData,
    filters: { companyId: companyId || null }
  });
};
/* ================================
   Monthly Income Report
================================ */
export const monthlyIncomeReport = async (req, res) => {
  const { companyId } = req.query;
  
  let matchQuery = { type: "income" };

  if (req.user && req.user._id) {
    matchQuery.teacher = req.user._id;
  }
  
  if (companyId) {
    matchQuery.company = new mongoose.Types.ObjectId(companyId);
  }

  const report = await FinanceRecord.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          monthName: { $dateToString: { format: "%Y-%m", date: "$date" } }
        },
        totalIncome: { $sum: "$amount" },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } }
  ]);

  const chartData = {
    labels: report.map(item => item._id.monthName),
    datasets: [
      {
        label: "Monthly Income",
        data: report.map(item => item.totalIncome),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1
      }
    ]
  };

  res.json({ 
    success: true, 
    data: report,
    chart: chartData,
    summary: {
      totalIncome: report.reduce((sum, item) => sum + item.totalIncome, 0),
      averageIncome: report.length > 0 ? report.reduce((sum, item) => sum + item.totalIncome, 0) / report.length : 0
    },
    filters: { companyId: companyId || null }
  });
};

/* ================================
   Income Between Two Dates
================================ */
export const incomeByDateRange = async (req, res) => {
  const { start, end, companyId } = req.query;

  if (!start || !end) {
    return res.status(400).json({
      success: false,
      message: "start and end dates are required"
    });
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  let matchQuery = {
    type: "income",
    date: { $gte: startDate, $lte: endDate }
  };

  if (req.user && req.user._id) {
    matchQuery.teacher = req.user._id;
  }
  
  if (companyId) {
    matchQuery.company = new mongoose.Types.ObjectId(companyId);
  }

  const report = await FinanceRecord.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalIncome: { $sum: "$amount" },
        count: { $sum: 1 }
      }
    }
  ]);

  const dailyChart = await FinanceRecord.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        dailyIncome: { $sum: "$amount" },
        transactions: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  res.json({ 
    success: true, 
    data: report,
    chart: {
      labels: dailyChart.map(item => item._id),
      datasets: [
        {
          label: "Daily Income",
          data: dailyChart.map(item => item.dailyIncome),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.2)"
        }
      ]
    },
    details: {
      dailyData: dailyChart,
      totalDays: dailyChart.length
    },
    filters: { start, end, companyId: companyId || null }
  });
};

/* ================================
   Companies Worked Between Dates
================================ */
export const companiesWorkedBetween = async (req, res) => {
  const { start, end, companyId } = req.query;

  if (!start || !end) {
    return res.status(400).json({
      success: false,
      message: "start and end dates are required"
    });
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  let matchQuery = {
    date: { $gte: startDate, $lte: endDate },
    attended: true
  };

  if (req.user && req.user._id) {
    let classQuery = { teacher: req.user._id };
    
    if (companyId) {
      classQuery.company = companyId;
    }
    
    const classIds = await ClassTemplate.find(classQuery).select("_id");
    matchQuery.classTemplate = { $in: classIds.map(c => c._id) };
  }

  const report = await DailyClassLog.aggregate([
    { $match: matchQuery },
    {
      $lookup: {
        from: "classtemplates",
        localField: "classTemplate",
        foreignField: "_id",
        as: "class"
      }
    },
    { $unwind: "$class" },
    {
      $lookup: {
        from: "companies",
        localField: "class.company",
        foreignField: "_id",
        as: "company"
      }
    },
    { $unwind: "$company" },
    {
      $group: {
        _id: "$company.name",
        companyId: { $first: "$company._id" },
        totalHours: { $sum: "$hoursTaught" },
        totalClasses: { $sum: 1 }
      }
    },
    { $sort: { totalHours: -1 } }
  ]);

  const chartData = {
    labels: report.map(item => item._id),
    datasets: [
      {
        label: "Total Hours by Company",
        data: report.map(item => item.totalHours),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)"
        ]
      }
    ]
  };

  res.json({ 
    success: true, 
    data: report,
    chart: chartData,
    summary: {
      totalCompanies: report.length,
      totalHours: report.reduce((sum, item) => sum + item.totalHours, 0),
      totalClasses: report.reduce((sum, item) => sum + item.totalClasses, 0)
    },
    filters: { start, end, companyId: companyId || null }
  });
};

/* ================================
   Contracts Report
================================ */
export const contractsReport = catchAsync(async (req, res, next) => {
  let query = {};
  
  if (req.user && req.user._id) {
    query.teacher = req.user._id;
  }

  const contracts = await Contract.find(query)
    .populate({ path: "company", select: "name" })
    .sort({ createdAt: -1 });

  const reportData = contracts.map(contract => ({
    _id: contract._id,
    title: contract.title,
    companyName: contract.company?.name || "-",
    hourlyRate: contract.hourlyRate,
    totalHours: contract.totalHours,
    taughtHours: contract.taughtHours,
    totalAmount: contract.totalAmount,
    paidAmount: contract.paidAmount,
    status: contract.status,
    progressByHours: contract.totalHours > 0 ? Math.round((contract.taughtHours / contract.totalHours) * 100) : 0,
    progressByAmount: contract.totalAmount > 0 ? Math.round((contract.paidAmount / contract.totalAmount) * 100) : 0
  }));

  return res.status(200).json({
    success: true,
    data: reportData,
    results: reportData.length
  });
});

/* ================================
   Classes Report (بر اساس GeneratedClass و حضور)
================================ */
export const classesReport = catchAsync(async (req, res) => {
  try {
    const { startDate, endDate, companyId } = req.query;
    const teacherId = req.user._id;

    // شرط اولیه
    let matchQuery = { 
      teacher: teacherId, 
      attended: true,
      status: "attended"
    };

    // اضافه کردن بازه زمانی
    if (startDate && endDate) {
      matchQuery.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // اضافه کردن فیلتر شرکت
    if (companyId && mongoose.Types.ObjectId.isValid(companyId)) {
      matchQuery.company = new mongoose.Types.ObjectId(companyId);
    }

    // گرفتن کلاس‌ها
    const classes = await GeneratedClass.find(matchQuery)
      .populate("company", "name")
      .populate("contract", "title hourlyRate")
      .sort({ date: 1 });

    // محاسبه خلاصه
    const totalHours = classes.reduce((sum, c) => sum + (c.hoursTaught || 0), 0);
    const totalClasses = classes.length;
    const avgHoursPerClass = totalClasses > 0 ? (totalHours / totalClasses).toFixed(1) : "0";

    // داده برای چارت روزانه
    const dailyMap = new Map();
    classes.forEach((c) => {
      const jalaliDate = moment(c.date).format("jYYYY-jMM-jDD");
      if (!dailyMap.has(jalaliDate)) {
        dailyMap.set(jalaliDate, { hours: 0, classes: 0, date: jalaliDate });
      }
      const existing = dailyMap.get(jalaliDate);
      existing.hours += c.hoursTaught || 0;
      existing.classes += 1;
    });

    const dailyData = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    const chartData = {
      labels: dailyData.map(item => item.date),
      datasets: [
        {
          label: "ساعت تدریس",
          data: dailyData.map(item => item.hours),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgb(54, 162, 235)",
          borderWidth: 1,
        },
        {
          label: "تعداد کلاس",
          data: dailyData.map(item => item.classes),
          backgroundColor: "rgba(255, 99, 132, 0.6)",
          borderColor: "rgb(255, 99, 132)",
          borderWidth: 1,
        },
      ],
    };

    // داده برای جدول شرکت‌ها
    const companyMap = new Map();
    classes.forEach((c) => {
      const companyName = c.company?.name || "بدون شرکت";
      if (!companyMap.has(companyName)) {
        companyMap.set(companyName, { hours: 0, classes: 0, companyName });
      }
      const existing = companyMap.get(companyName);
      existing.hours += c.hoursTaught || 0;
      existing.classes += 1;
    });

    const companyData = Array.from(companyMap.values());

    res.json({
      success: true,
      data: classes,
      summary: {
        totalHours,
        totalClasses,
        avgHoursPerClass,
      },
      chart: chartData,
      companyStats: companyData,
    });
  } catch (error) {
    console.error("Error in classesReport:", error);
    res.status(500).json({
      success: false,
      message: "خطا در دریافت گزارش کلاس‌ها",
      error: error.message,
    });
  }
});