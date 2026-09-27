import Invoice from "../Models/invoiceMd.js";
import GeneratedClass from "../Models/generatedClassMd.js";
import Contract from "../Models/contractMd.js";
import { catchAsync, HandleERROR } from "vanta-api";
import moment from "moment-jalaali";

// تابع کمکی برای محاسبه ساعات تدریس در یک ماه
const calculateMonthlyHours = async (teacherId, contractId, year, month) => {
  const startDate = moment(`${year}/${month}/01`, "jYYYY/jMM/jDD").startOf("month").toDate();
  const endDate = moment(`${year}/${month}/01`, "jYYYY/jMM/jDD").endOf("month").toDate();
  
  const classes = await GeneratedClass.find({
    teacher: teacherId,
    contract: contractId,
    date: { $gte: startDate, $lte: endDate },
    attended: true,
    status: "attended"
  });
  
  return classes.reduce((sum, cls) => sum + (cls.hoursTaught || 0), 0);
};

// دریافت همه صورتحساب‌ها
export const getAllInvoices = catchAsync(async (req, res) => {
  const invoices = await Invoice.find({ teacher: req.user._id })
    .populate("company", "name")
    .populate("contract", "title hourlyRate")
    .sort({ year: -1, month: -1 });
  
  const summary = {
    totalAmount: 0,
    totalPaidAmount: 0,
    totalRemaining: 0,
    pending: 0,
    partial: 0,
    paid: 0,
    overdue: 0
  };
  
  for (const inv of invoices) {
    summary.totalAmount += inv.amount || 0;
    summary.totalPaidAmount += inv.paidAmount || 0;
    summary.totalRemaining += (inv.amount - inv.paidAmount) || 0;
    
    if (inv.status === "pending") summary.pending++;
    else if (inv.status === "partial") summary.partial++;
    else if (inv.status === "paid") summary.paid++;
    else if (inv.status === "overdue") summary.overdue++;
  }
  
  res.json({
    success: true,
    data: invoices,
    summary,
    results: invoices.length
  });
});

// دریافت صورتحساب‌های یک شرکت
export const getInvoicesByCompany = catchAsync(async (req, res) => {
  const { companyId } = req.params;
  
  const invoices = await Invoice.find({
    teacher: req.user._id,
    company: companyId
  })
    .populate("contract", "title hourlyRate")
    .sort({ year: -1, month: -1 });
  
  const summary = {
    totalAmount: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    totalPaidAmount: invoices.reduce((sum, inv) => sum + inv.paidAmount, 0),
    totalRemaining: invoices.reduce((sum, inv) => sum + inv.getRemainingAmount(), 0)
  };
  
  res.json({
    success: true,
    data: invoices,
    summary,
    results: invoices.length
  });
});

// دریافت یک صورتحساب
export const getInvoice = catchAsync(async (req, res) => {
  const invoice = await Invoice.findOne({
    _id: req.params.id,
    teacher: req.user._id
  })
    .populate("company", "name phone address")
    .populate("contract", "title hourlyRate")
    .populate("financeRecords", "amount date paymentMethod description");
  
  if (!invoice) {
    throw new HandleERROR("Invoice not found", 404);
  }
  
  res.json({
    success: true,
    data: invoice,
    remainingAmount: invoice.getRemainingAmount()
  });
});

// تولید صورتحساب ماهانه
// تولید صورتحساب ماهانه
export const generateMonthlyInvoice = catchAsync(async (req, res) => {
  const { year, month } = req.body;
  
  if (!year || !month) {
    throw new HandleERROR("سال و ماه الزامی است", 400);
  }
  
  const teacherId = req.user._id;
  
  // ✅ تبدیل year/month میلادی به شمسی برای جستجوی کلاس‌ها
  const gregorianDate = moment(`${year}/${month}/01`, "YYYY/MM/DD");
  const jalaliYear = gregorianDate.jYear();
  const jalaliMonth = gregorianDate.jMonth() + 1;

  console.log("📅 Input (Gregorian):", year, month);
  console.log("📅 Converted (Jalali):", jalaliYear, jalaliMonth);

  const startDate = gregorianDate.clone().startOf("jMonth").toDate();
  const endDate = gregorianDate.clone().endOf("jMonth").toDate();

  console.log("📅 Date range:", startDate, "to", endDate);
  
  const contracts = await Contract.find({
    teacher: teacherId,
    status: "active"
  }).populate("company", "name");
  
  console.log("📄 Contracts found:", contracts.length);
  
  const results = [];
  
  for (const contract of contracts) {
    // چک کردن صورتحساب موجود
    const existingInvoice = await Invoice.findOne({
      teacher: teacherId,
      contract: contract._id,
      year: jalaliYear,
      month: jalaliMonth
    });
    
    if (existingInvoice) {
      results.push({ contract: contract.title, status: "already_exists" });
      continue;
    }
    
    // محاسبه ساعات تدریس
    const classes = await GeneratedClass.find({
      teacher: teacherId,
      date: { $gte: startDate, $lte: endDate },
      attended: true,
      status: "attended"
    });

    console.log(`📊 ${contract.title}: ${classes.length} classes found`);
    
    const totalHours = classes.reduce((sum, cls) => sum + (cls.hoursTaught || 0), 0);
    
    if (totalHours === 0) {
      results.push({ contract: contract.title, status: "no_hours", totalHours: 0 });
      continue;
    }
    
    const invoice = await Invoice.create({
      teacher: teacherId,
      company: contract.company?._id || contract.company,
      contract: contract._id,
      month: jalaliMonth,
      year: jalaliYear,
      totalHours: totalHours,
      hourlyRate: contract.hourlyRate || 0,
      description: `صورتحساب ${contract.title} - ${jalaliMonth}/${jalaliYear}`
    });
    
    results.push({
      contract: contract.title,
      status: "created",
      totalHours: totalHours,
      amount: invoice.amount
    });
  }
  
  res.json({
    success: true,
    message: `تولید صورتحساب‌ها انجام شد (${results.length} قرارداد)`,
    data: results
  });
});

// دریافت بدهی جاری
export const getCurrentDebt = catchAsync(async (req, res) => {
  const invoices = await Invoice.find({
    teacher: req.user._id,
    status: { $in: ["pending", "partial", "overdue"] }
  }).populate("company", "name");
  
  const totalDebt = invoices.reduce((sum, inv) => sum + inv.getRemainingAmount(), 0);
  
  const byCompany = {};
  for (const invoice of invoices) {
    const companyName = invoice.company?.name || "نامشخص";
    byCompany[companyName] = (byCompany[companyName] || 0) + invoice.getRemainingAmount();
  }
  
  res.json({
    success: true,
    data: {
      totalDebt,
      byCompany,
      invoicesCount: invoices.length
    }
  });
});

// دیباگ - دریافت کلاس‌های یک ماه خاص
export const debugMonthlyClasses = catchAsync(async (req, res) => {
  const { year, month } = req.query;
  
  if (!year || !month) {
    return res.status(400).json({ 
      success: false, 
      error: "year and month required" 
    });
  }
  
  const startDate = moment(`${year}/${month}/01`, "jYYYY/jMM/jDD").startOf("month").toDate();
  const endDate = moment(`${year}/${month}/01`, "jYYYY/jMM/jDD").endOf("month").toDate();
  
  const allClasses = await GeneratedClass.find({
    teacher: req.user._id,
    date: { $gte: startDate, $lte: endDate }
  }).populate("contract", "title hourlyRate");
  
  const attendedClasses = await GeneratedClass.find({
    teacher: req.user._id,
    date: { $gte: startDate, $lte: endDate },
    attended: true,
    status: "attended"
  }).populate("contract", "title hourlyRate");
  
  const totalHours = attendedClasses.reduce((sum, cls) => sum + (cls.hoursTaught || 0), 0);
  
  res.json({
    success: true,
    debug: {
      year: parseInt(year),
      month: parseInt(month),
      startDate,
      endDate,
      allClassesCount: allClasses.length,
      allClasses: allClasses.map(c => ({
        title: c.title,
        date: c.date,
        jalaliDate: moment(c.date).format("jYYYY-jMM-jDD"),
        attended: c.attended,
        status: c.status,
        hoursTaught: c.hoursTaught,
        contractTitle: c.contract?.title
      })),
      attendedClassesCount: attendedClasses.length,
      totalHours
    }
  });
});