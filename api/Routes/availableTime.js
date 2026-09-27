import { Router } from "express";
import { protect } from "../Middleware/authMiddleware.js";
import {
  getAllAvailableTimes,
  getAvailableTime,
  createAvailableTime,
  updateAvailableTime,
  deleteAvailableTime
} from "../Controllers/availableTimeController.js";

const availableTimeRouter = Router();

availableTimeRouter.use(protect);

availableTimeRouter
  .route("/")
  .get(getAllAvailableTimes)
  .post(createAvailableTime);

availableTimeRouter
  .route("/:id")
  .get(getAvailableTime)
  .put(updateAvailableTime)
  .delete(deleteAvailableTime);

export default availableTimeRouter;