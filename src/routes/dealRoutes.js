import express from "express";
import {
  getDeals,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal,
} from "../controllers/dealController.js";

const router = express.Router();

router.route("/").get(getDeals).post(createDeal);
router.route("/:id").get(getDealById).put(updateDeal).delete(deleteDeal);

export default router;
