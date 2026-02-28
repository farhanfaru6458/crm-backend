import express from "express";
import {
  getDeals,
  getDealById,
  createDeal,
  bulkCreateDeals,
  updateDeal,
  deleteDeal,
  bulkDeleteDeals,
} from "../controllers/dealController.js";

const router = express.Router();

router.route("/").get(getDeals).post(createDeal);
router.post("/bulk-create", bulkCreateDeals);
router.post("/bulk-delete", bulkDeleteDeals);
router.route("/:id").get(getDealById).put(updateDeal).delete(deleteDeal);

export default router;
