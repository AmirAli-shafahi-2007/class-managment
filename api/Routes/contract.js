import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import { uploadContractFile } from "../Middleware/upload.js";
import {
  getAllContracts,
  getContract,
  createContract,
  updateContract,
  deleteContract,
  downloadContractFile,
  deleteContractFile
} from "../Controllers/contractController.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getAllContracts)
  .post(uploadContractFile, createContract);

router.route("/:id")
  .get(getContract)
  .put(uploadContractFile, updateContract)
  .delete(deleteContract);

router.get("/:id/download", downloadContractFile);
router.delete("/:id/file", deleteContractFile);

export default router;