import express from "express";
import {
  getLeads,
  getLeadById,
  createLead,
  bulkCreateLeads,
  updateLead,
  deleteLead,
  bulkDeleteLeads,
} from "../controllers/leadController.js";

const router = express.Router();

router.route("/").get(getLeads).post(createLead);
router.post("/bulk-create", bulkCreateLeads);
router.post("/bulk-delete", bulkDeleteLeads);
router.route("/:id").get(getLeadById).put(updateLead).delete(deleteLead);

export default router;
