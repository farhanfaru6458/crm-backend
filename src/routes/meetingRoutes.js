import express from "express";
import {
  getMeetingsByEntity,
  createMeeting,
} from "../controllers/meetingController.js";

const router = express.Router();

router.route("/").get(getMeetingsByEntity).post(createMeeting);

export default router;
