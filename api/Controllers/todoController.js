import { catchAsync, HandleERROR } from "vanta-api";
import ToDo from "../Models/todoMd.js";

export const getAllTodos = catchAsync(async (req, res, next) => {
  const todos = await ToDo.find({ teacher: req.user._id })
    .populate({ path: "teacher", select: "name" })
    .sort({ createdAt: -1 });

  return res.status(200).json({
    data: todos,
    results: todos.length,
  });
});

export const getTodo = catchAsync(async (req, res, next) => {
  const todo = await ToDo.findOne({
    _id: req.params.id,
    teacher: req.user._id,
  }).populate({ path: "teacher", select: "name" });

  if (!todo) {
    return next(new HandleERROR("Todo not found", 404));
  }

  return res.status(200).json({
    success: true,
    data: [todo],
    results: 1,
  });
});

export const createTodo = catchAsync(async (req, res, next) => {
  req.body.teacher = req.user._id;

  const todo = await ToDo.create(req.body);

  return res.status(201).json({
    message: "Todo created successfully",
    data: todo,
    success: true,
  });
});

export const updateTodo = catchAsync(async (req, res, next) => {
  // جلوگیری از انتقال رکورد به کاربر دیگر
  const { teacher, _id, ...data } = req.body;

  const todo = await ToDo.findOneAndUpdate(
    { _id: req.params.id, teacher: req.user._id },
    data,
    { new: true, runValidators: true }
  );

  if (!todo) {
    return next(new HandleERROR("Todo not found", 404));
  }

  return res.status(200).json({
    message: "Todo updated successfully",
    data: todo,
    success: true,
  });
});

export const deleteTodo = catchAsync(async (req, res, next) => {
  const todo = await ToDo.findOneAndDelete({
    _id: req.params.id,
    teacher: req.user._id,
  });

  if (!todo) {
    return next(new HandleERROR("Todo not found", 404));
  }

  return res.status(200).json({
    message: "Todo deleted successfully",
    success: true,
  });
});