import express from "express";
import { getNotesByEntity, createNote } from "../controllers/noteController.js";

const router = express.Router();

router.route("/").get(getNotesByEntity).post(createNote);

export default router;
