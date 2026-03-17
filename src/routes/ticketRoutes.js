import express from "express";
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  bulkCreateTickets,
  bulkDeleteTickets,
  syncTicketEmails,
} from "../controllers/ticketController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // protect all routes

router.post("/", createTicket);
router.post("/bulk-create", bulkCreateTickets);
router.post("/bulk-delete", bulkDeleteTickets);
router.post("/sync-emails", syncTicketEmails);
router.get("/", getTickets);
router.get("/:id", getTicketById);
router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);

export default router;