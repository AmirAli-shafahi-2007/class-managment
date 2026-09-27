import { catchAsync, HandleERROR } from "vanta-api";
import Company from "../Models/companyMd.js";

// همه عملیات فقط روی شرکت‌هایی است که خود کاربر ساخته (createdBy)

export const getAllCompanies = catchAsync(async (req, res, next) => {
  const companies = await Company.find({ createdBy: req.user._id }).sort({ name: 1 });

  return res.status(200).json({
    data: companies,
    results: companies.length,
  });
});

export const getCompany = catchAsync(async (req, res, next) => {
  const company = await Company.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!company) {
    return next(new HandleERROR("Company not found", 404));
  }

  return res.status(200).json({
    data: [company],
    results: 1,
  });
});

export const createCompany = catchAsync(async (req, res, next) => {
  req.body.createdBy = req.user._id;

  const company = await Company.create(req.body);

  return res.status(201).json({
    message: "Company created successfully",
    data: company,
    success: true,
  });
});

export const updateCompany = catchAsync(async (req, res, next) => {
  // جلوگیری از انتقال شرکت به کاربر دیگر
  const { createdBy, _id, ...data } = req.body;

  const company = await Company.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    data,
    { new: true, runValidators: true }
  );

  if (!company) {
    return next(new HandleERROR("Company not found", 404));
  }

  return res.status(200).json({
    message: "Company updated successfully",
    data: company,
    success: true,
  });
});

export const deleteCompany = catchAsync(async (req, res, next) => {
  const company = await Company.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!company) {
    return next(new HandleERROR("Company not found", 404));
  }

  return res.status(200).json({
    message: "Company deleted successfully",
    success: true,
  });
});