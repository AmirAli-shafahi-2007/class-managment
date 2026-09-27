import { catchAsync, HandleERROR } from "vanta-api";
import AvailableTime from "../Models/availableTimeMd.js";

export const getAllAvailableTimes = catchAsync(async (req, res, next) => {
  const times = await AvailableTime.find({ teacher: req.user._id })
    .populate({ path: "teacher", select: "name" })
    .sort({ dayOfWeek: 1, startTime: 1 });

  return res.status(200).json({
    data: times,
    results: times.length,
  });
});

export const getAvailableTime = catchAsync(async (req, res, next) => {
  const availableTime = await AvailableTime.findOne({
    _id: req.params.id,
    teacher: req.user._id,
  }).populate({ path: "teacher", select: "name" });

  if (!availableTime) {
    return next(new HandleERROR("Available time not found", 404));
  }

  return res.status(200).json({
    success: true,
    data: [availableTime],
    results: 1,
  });
});

export const createAvailableTime = catchAsync(async (req, res, next) => {
  req.body.teacher = req.user._id;

  const availableTime = await AvailableTime.create(req.body);

  return res.status(201).json({
    message: "Available time created successfully",
    data: availableTime,
    success: true,
  });
});

export const updateAvailableTime = catchAsync(async (req, res, next) => {
  // جلوگیری از انتقال رکورد به کاربر دیگر
  const { teacher, _id, ...data } = req.body;

  const availableTime = await AvailableTime.findOneAndUpdate(
    { _id: req.params.id, teacher: req.user._id },
    data,
    { new: true, runValidators: true }
  );

  if (!availableTime) {
    return next(new HandleERROR("Available time not found", 404));
  }

  return res.status(200).json({
    message: "Available time updated successfully",
    data: availableTime,
    success: true,
  });
});

export const deleteAvailableTime = catchAsync(async (req, res, next) => {
  const availableTime = await AvailableTime.findOneAndDelete({
    _id: req.params.id,
    teacher: req.user._id,
  });

  if (!availableTime) {
    return next(new HandleERROR("Available time not found", 404));
  }

  return res.status(200).json({
    message: "Available time deleted successfully",
    success: true,
  });
});