import express from "express";
import {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "../controllers/companyController.js";

const router = express.Router();

router.route("/")
  .post(createCompany)
  .get(getCompanies);

router.route("/:id")
  .get(getCompanyById)
  .put(updateCompany)
  .delete(deleteCompany);

export default router;