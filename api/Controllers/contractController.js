import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Contract from "../Models/contractMd.js";
import fs from "fs";
import path from "path";

// دریافت همه قراردادها
export const getAllContracts = catchAsync(async (req, res, next) => {
  let query = {};
  
  if (req.user && req.user._id) {
    query.teacher = req.user._id;
  }

  const contracts = await Contract.find(query)
    .populate({ path: "teacher", select: "username" })
    .populate({ path: "company", select: "name phone" })
    .sort({ createdAt: -1 });

  return res.status(200).json({
    data: contracts,
    results: contracts.length,
  });
});

// دریافت یک قرارداد
export const getContract = catchAsync(async (req, res, next) => {
  const contract = await Contract.findOne({
    _id: req.params.id,
    teacher: req.user._id
  }).populate("company", "name phone address");

  if (!contract) {
    return next(new HandleERROR("Contract not found", 404));
  }

  return res.status(200).json({
    success: true,
    data: contract
  });
});

// ایجاد قرارداد جدید
export const createContract = catchAsync(async (req, res, next) => {
  if (req.user && req.user._id) {
    req.body.teacher = req.user._id;
  }

  if (req.file) {
    req.body.contractFile = req.file.path;
    req.body.contractFileName = req.file.originalname;
    req.body.contractFileType = req.file.mimetype;
  }

  const contract = await Contract.create(req.body);

  return res.status(201).json({
    success: true,
    message: "Contract created successfully",
    data: contract,
  });
});

// ویرایش قرارداد
export const updateContract = catchAsync(async (req, res, next) => {
  if (req.file) {
    const oldContract = await Contract.findById(req.params.id);
    if (oldContract && oldContract.contractFile) {
      try {
        if (fs.existsSync(oldContract.contractFile)) {
          fs.unlinkSync(oldContract.contractFile);
        }
      } catch (err) {
        console.error("خطا در حذف فایل قدیمی:", err);
      }
    }
    
    req.body.contractFile = req.file.path;
    req.body.contractFileName = req.file.originalname;
    req.body.contractFileType = req.file.mimetype;
  }

  const contract = await Contract.findOneAndUpdate(
    { _id: req.params.id, teacher: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!contract) {
    return next(new HandleERROR("Contract not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Contract updated successfully",
    data: contract,
  });
});

// حذف قرارداد
export const deleteContract = catchAsync(async (req, res, next) => {
  const contract = await Contract.findOneAndDelete({
    _id: req.params.id,
    teacher: req.user._id
  });

  if (!contract) {
    return next(new HandleERROR("Contract not found", 404));
  }

  if (contract.contractFile) {
    try {
      if (fs.existsSync(contract.contractFile)) {
        fs.unlinkSync(contract.contractFile);
      }
    } catch (err) {
      console.error("خطا در حذف فایل:", err);
    }
  }

  return res.status(200).json({
    success: true,
    message: "Contract deleted successfully",
  });
});

// دانلود فایل قرارداد
export const downloadContractFile = catchAsync(async (req, res, next) => {
  const contract = await Contract.findOne({
    _id: req.params.id,
    teacher: req.user._id
  });

  if (!contract) {
    return next(new HandleERROR("Contract not found", 404));
  }

  if (!contract.contractFile) {
    return next(new HandleERROR("No file attached to this contract", 404));
  }

  const filePath = path.resolve(contract.contractFile);
  
  if (!fs.existsSync(filePath)) {
    return next(new HandleERROR("File not found", 404));
  }

  res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(contract.contractFileName)}"`);
  res.setHeader("Content-Type", contract.contractFileType || "application/octet-stream");
  
  res.download(filePath, contract.contractFileName);
});

// حذف فایل قرارداد
export const deleteContractFile = catchAsync(async (req, res, next) => {
  const contract = await Contract.findOne({
    _id: req.params.id,
    teacher: req.user._id
  });

  if (!contract) {
    return next(new HandleERROR("Contract not found", 404));
  }

  if (!contract.contractFile) {
    return next(new HandleERROR("No file attached to this contract", 404));
  }

  try {
    if (fs.existsSync(contract.contractFile)) {
      fs.unlinkSync(contract.contractFile);
    }
  } catch (err) {
    console.error("خطا در حذف فایل:", err);
  }

  contract.contractFile = null;
  contract.contractFileName = null;
  contract.contractFileType = null;
  await contract.save();

  return res.status(200).json({
    success: true,
    message: "File deleted successfully",
  });
});