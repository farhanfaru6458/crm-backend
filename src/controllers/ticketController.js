import Ticket from "../models/Ticket.js";
import mongoose from "mongoose";

/* ================= CREATE ================= */
export const createTicket = async (req, res) => {
  try {
    let {
      ticketName,
      description,
      status,
      source,
      priority,
      owner,
      associatedDealId,
      associatedCompanyId,
    } = req.body;

    if (!ticketName || !status || !source || !priority || !owner) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const normalize = (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    status = normalize(status);
    source = normalize(source);
    priority = normalize(priority);

    if (associatedDealId && associatedCompanyId) {
      return res.status(400).json({ message: "Ticket cannot be linked to both Deal and Company" });
    }

    const validDealId = associatedDealId && mongoose.Types.ObjectId.isValid(associatedDealId) ? associatedDealId : null;
    const validCompanyId = associatedCompanyId && mongoose.Types.ObjectId.isValid(associatedCompanyId) ? associatedCompanyId : null;

    const ticket = await Ticket.create({
      ticketName,
      description: description || "",
      status,
      source,
      priority,
      owner,
      associatedDealId: validDealId,
      associatedCompanyId: validCompanyId,
      user: req.user?.id || null,
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error("CREATE TICKET ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ALL ================= */
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("associatedDealId", "dealName")
      .populate("associatedCompanyId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(tickets);
  } catch (error) {
    console.error("GET TICKETS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET SINGLE ================= */
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("associatedDealId", "dealName")
      .populate("associatedCompanyId", "name");

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    res.status(200).json(ticket);
  } catch (error) {
    console.error("GET TICKET ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE ================= */
export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const {
      ticketName,
      description,
      status,
      source,
      priority,
      owner,
      associatedDealId,
      associatedCompanyId,
    } = req.body;

    if (associatedDealId && associatedCompanyId) {
      return res.status(400).json({ message: "Ticket cannot be linked to both Deal and Company" });
    }

    const validDealId = associatedDealId && mongoose.Types.ObjectId.isValid(associatedDealId) ? associatedDealId : null;
    const validCompanyId = associatedCompanyId && mongoose.Types.ObjectId.isValid(associatedCompanyId) ? associatedCompanyId : null;

    ticket.ticketName = ticketName ?? ticket.ticketName;
    ticket.description = description ?? ticket.description;
    ticket.status = status ?? ticket.status;
    ticket.source = source ?? ticket.source;
    ticket.priority = priority ?? ticket.priority;
    ticket.owner = owner ?? ticket.owner;
    ticket.associatedDealId = validDealId;
    ticket.associatedCompanyId = validCompanyId;

    const updated = await ticket.save();
    res.status(200).json(updated);
  } catch (error) {
    console.error("UPDATE TICKET ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE ================= */
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("DELETE TICKET ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= BULK CREATE ================= */
export const bulkCreateTickets = async (req, res) => {
  try {
    const tickets = req.body.map(t => ({ ...t, user: req.user?.id || null }));
    const normalize = (v) => v ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase() : v;
    
    tickets.forEach(t => {
      if (t.status) t.status = normalize(t.status);
      if (t.source) t.source = normalize(t.source);
      if (t.priority) t.priority = normalize(t.priority);
    });

    const created = await Ticket.insertMany(tickets);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error("BULK CREATE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= BULK DELETE ================= */
export const bulkDeleteTickets = async (req, res) => {
  try {
    const { ids } = req.body;
    await Ticket.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ success: true, message: "Tickets deleted successfully" });
  } catch (error) {
    console.error("BULK DELETE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};