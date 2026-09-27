import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import {
  getAllCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany
} from "../Controllers/companyController.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getAllCompanies)
  .post(createCompany);

router.route("/:id")
  .get(getCompany)
  .put(updateCompany)
  .delete(deleteCompany);

export default router;