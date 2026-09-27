import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import FinanceRecord from "../Models/financeRecordMd.js";
import Contract from "../Models/contractMd.js";
import Invoice from "../Models/invoiceMd.js";
import fs from "fs";
import path from "path";



export const getAllFinanceRecords = catchAsync(async (req, res, next) => {
  let query = {};
  
  if (req.user && req.user._id) {
    query.teacher = req.user._id;
  }

  const records = await FinanceRecord.find(query)
    .populate({ path: "teacher", select: "name" })
    .populate({ path: "company", select: "name" })
    .populate({ path: "contract", select: "title hourlyRate totalHours taughtHours paidAmount" })
    .sort({ createdAt: -1 });

  return res.status(200).json({
    data: records,
    results: records.length,
  });
  
});

export const getFinanceRecord = catchAsync(async (req, res, next) => {
  const record = await FinanceRecord.findById(req.params.id)
    .populate({ path: "teacher", select: "name" })
    .populate({ path: "company", select: "name" })
    .populate({ path: "contract", select: "title hourlyRate totalHours taughtHours paidAmount" });

  if (!record) {
    return next(new HandleERROR("Finance record not found", 404));
  }

  return res.status(200).json({
    data: [record],
    results: 1,
  });
});

export const createFinanceRecord = catchAsync(async (req, res, next) => {
  if (req.user && req.user._id) {
    req.body.teacher = req.user._id;
  }

  // اگر فایل آپلود شده
  if (req.file) {
    req.body.receiptFile = req.file.path;
    req.body.receiptFileName = req.file.originalname;
    req.body.receiptFileType = req.file.mimetype;
  }

  // چک کن contract مال همین معلم باشه
  if (req.body.contract && req.user && req.user._id) {
    const contract = await Contract.findOne({
      _id: req.body.contract,
      teacher: req.user._id
    });

    if (!contract) {
      return res.status(403).json({
        success: false,
        message: "این قرارداد متعلق به شما نیست"
      });
    }
  }

  const record = await FinanceRecord.create(req.body);

  // ✅ اگر درآمد هست و قرارداد دارد، مبلغ رو از صورتحساب کم کن
  if (record.type === "income" && record.contract && record.amount > 0) {
    // پیدا کردن قدیمی‌ترین صورتحساب با بدهی برای این قرارداد
    const invoice = await Invoice.findOne({
      teacher: req.user._id,
      contract: record.contract,
      status: { $in: ["pending", "partial"] }
    }).sort({ year: 1, month: 1 });
    
    if (invoice) {
      await invoice.addPayment(record.amount, record._id);
    }
  }

  return res.status(201).json({
    message: "Finance record created successfully",
    data: record,
    success: true,
  });
});

export const updateFinanceRecord = catchAsync(async (req, res, next) => {
  const oldRecord = await FinanceRecord.findById(req.params.id);
  
  let filter = { _id: req.params.id };
  if (req.user && req.user._id) {
    filter.teacher = req.user._id;
  }

  // اگر فایل جدید آپلود شده، فایل قبلی رو حذف کن
  if (req.file) {
    if (oldRecord && oldRecord.receiptFile) {
      try {
        if (fs.existsSync(oldRecord.receiptFile)) {
          fs.unlinkSync(oldRecord.receiptFile);
        }
      } catch (err) {
        console.error("خطا در حذف فایل قدیمی:", err);
      }
    }
    
    req.body.receiptFile = req.file.path;
    req.body.receiptFileName = req.file.originalname;
    req.body.receiptFileType = req.file.mimetype;
  }

  const record = await FinanceRecord.findOneAndUpdate(
    filter,
    req.body,
    { new: true, runValidators: true }
  );

  if (!record) {
    return next(new HandleERROR("Finance record not found", 404));
  }

  // بازمحاسبه مبلغ پرداخت شده قرارداد بعد از ویرایش
  if (record.contract) {
    const allIncomes = await FinanceRecord.find({ 
      contract: record.contract, 
      type: "income" 
    });
    const totalPaid = allIncomes.reduce((sum, inc) => sum + (inc.amount || 0), 0);
    
    const contract = await Contract.findById(record.contract);
    if (contract) {
      contract.paidAmount = totalPaid;
      if (contract.paidAmount >= contract.totalAmount && contract.totalAmount > 0) {
        contract.status = "finished";
      } else if (contract.paidAmount < contract.totalAmount && contract.status === "finished") {
        contract.status = "active";
      }
      await contract.save();
    }
  }

  return res.status(200).json({
    message: "Finance record updated successfully",
    data: record,
    success: true,
  });
});

export const deleteFinanceRecord = catchAsync(async (req, res, next) => {
  const oldRecord = await FinanceRecord.findById(req.params.id);
  
  let filter = { _id: req.params.id };
  if (req.user && req.user._id) {
    filter.teacher = req.user._id;
  }

  const record = await FinanceRecord.findOneAndDelete(filter);

  if (!record) {
    return next(new HandleERROR("Finance record not found", 404));
  }

  // حذف فایل همراه اگر وجود داشته باشد
  if (record.receiptFile) {
    try {
      if (fs.existsSync(record.receiptFile)) {
        fs.unlinkSync(record.receiptFile);
      }
    } catch (err) {
      console.error("خطا در حذف فایل:", err);
    }
  }

  // بازمحاسبه مبلغ پرداخت شده قرارداد بعد از حذف
  if (record.contract && record.type === "income") {
    const allIncomes = await FinanceRecord.find({ 
      contract: record.contract, 
      type: "income" 
    });
    const totalPaid = allIncomes.reduce((sum, inc) => sum + (inc.amount || 0), 0);
    
    const contract = await Contract.findById(record.contract);
    if (contract) {
      contract.paidAmount = totalPaid;
      if (contract.paidAmount >= contract.totalAmount && contract.totalAmount > 0) {
        contract.status = "finished";
      } else if (contract.paidAmount < contract.totalAmount && contract.status === "finished") {
        contract.status = "active";
      }
      await contract.save();
    }
  }

  return res.status(200).json({
    message: "Finance record deleted successfully",
    success: true,
  });
});

// دانلود فایل رسید
export const downloadReceiptFile = catchAsync(async (req, res, next) => {
  const record = await FinanceRecord.findOne({ 
    _id: req.params.id, 
    teacher: req.user._id 
  });

  if (!record) {
    return next(new HandleERROR("Finance record not found", 404));
  }

  if (!record.receiptFile) {
    return next(new HandleERROR("No file attached to this record", 404));
  }

  const filePath = path.resolve(record.receiptFile);
  
  if (!fs.existsSync(filePath)) {
    return next(new HandleERROR("File not found", 404));
  }

  res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(record.receiptFileName)}"`);
  res.setHeader("Content-Type", record.receiptFileType || "application/octet-stream");
  
  res.download(filePath, record.receiptFileName);
});

// حذف فایل رسید
export const deleteReceiptFile = catchAsync(async (req, res, next) => {
  const record = await FinanceRecord.findOne({ 
    _id: req.params.id, 
    teacher: req.user._id 
  });

  if (!record) {
    return next(new HandleERROR("Finance record not found", 404));
  }

  if (!record.receiptFile) {
    return next(new HandleERROR("No file attached to this record", 404));
  }

  try {
    if (fs.existsSync(record.receiptFile)) {
      fs.unlinkSync(record.receiptFile);
    }
  } catch (err) {
    console.error("خطا در حذف فایل:", err);
  }

  record.receiptFile = null;
  record.receiptFileName = null;
  record.receiptFileType = null;
  await record.save();

  return res.status(200).json({
    success: true,
    message: "File deleted successfully",
  });
});