import { Router } from "express";
import { protect } from "../Middleware/authMiddleware.js";
import {
  getAllTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo
} from "../Controllers/todoController.js";

const todoRouter = Router();

// ✅ محافظت از همه routeها
todoRouter.use(protect);

todoRouter
  .route("/")
  .get(getAllTodos)
  .post(createTodo);

todoRouter
  .route("/:id")
  .get(getTodo)
  .put(updateTodo)
  .delete(deleteTodo);

export default todoRouter;