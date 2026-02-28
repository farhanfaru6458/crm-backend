import express from "express";
import {
  createCompany,
  bulkCreateCompanies,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  bulkDeleteCompanies,
} from "../controllers/companyController.js";

const router = express.Router();

router.route("/")
  .post(createCompany)
  .get(getCompanies);

router.post("/bulk-create", bulkCreateCompanies);
router.post("/bulk-delete", bulkDeleteCompanies);

router.route("/:id")
  .get(getCompanyById)
  .put(updateCompany)
  .delete(deleteCompany);

export default router;