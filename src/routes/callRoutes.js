import express from "express";
import { getCallsByEntity, createCall } from "../controllers/callController.js";

const router = express.Router();

router.route("/").get(getCallsByEntity).post(createCall);

export default router;
