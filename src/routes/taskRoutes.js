import express from "express";
import {
  getTasksByEntity,
  createTask,
  toggleTaskCompletion,
} from "../controllers/taskController.js";

const router = express.Router();

router.route("/").get(getTasksByEntity).post(createTask);
router.route("/:id/toggle").put(toggleTaskCompletion);

export default router;
