import express from "express";
import { getActivitiesByEntity, createActivity, updateActivity } from "../controllers/activityController.js";

const router = express.Router();

router.get("/:entityType/:entityId", getActivitiesByEntity);
router.post("/:entityType/:entityId", createActivity);
router.put("/:id", updateActivity);

export default router;
