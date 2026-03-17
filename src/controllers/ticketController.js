import Ticket from "../models/Ticket.js";
import Deal from "../models/Deal.js";
import Company from "../models/Company.js";
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

    let email = req.body.email || "";
    if (validDealId) {
      const deal = await Deal.findById(validDealId);
      if (deal && deal.email) email = deal.email;
    } else if (validCompanyId) {
      const company = await Company.findById(validCompanyId);
      if (company && company.email) email = company.email;
    }

    const ticket = await Ticket.create({
      ticketName,
      description: description || "",
      status,
      source,
      priority,
      owner,
      email,
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
      .populate("associatedDealId", "dealName email")
      .populate("associatedCompanyId", "name email")
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
      .populate("associatedDealId", "dealName email")
      .populate("associatedCompanyId", "name email");

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

    if (validDealId && (!ticket.email || associatedDealId !== ticket.associatedDealId?.toString())) {
      const deal = await Deal.findById(validDealId);
      if (deal && deal.email) ticket.email = deal.email;
    } else if (validCompanyId && (!ticket.email || associatedCompanyId !== ticket.associatedCompanyId?.toString())) {
      const company = await Company.findById(validCompanyId);
      if (company && company.email) ticket.email = company.email;
    }
    
    if (req.body.email) ticket.email = req.body.email;

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
    const ticketsData = req.body.map(t => ({ ...t, user: req.user?.id || null }));
    const normalize = (v) => v ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase() : v;
    
    for (const t of ticketsData) {
      if (t.status) t.status = normalize(t.status);
      if (t.source) t.source = normalize(t.source);
      if (t.priority) t.priority = normalize(t.priority);
      
      // Sync Email
      if (t.associatedDealId) {
        const deal = await Deal.findById(t.associatedDealId);
        if (deal && deal.email) t.email = deal.email;
      } else if (t.associatedCompanyId) {
        const company = await Company.findById(t.associatedCompanyId);
        if (company && company.email) t.email = company.email;
      }
    }

    const created = await Ticket.insertMany(ticketsData);
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

/* ================= SYNC EMAILS (Backfill all existing tickets) ================= */
export const syncTicketEmails = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    let syncedCount = 0;
    let associationsFixed = 0;

    for (const ticket of tickets) {
      let emailToSet = "";
      
      // If orphan, try to find a deal/company by owner first
      if (!ticket.associatedDealId && !ticket.associatedCompanyId) {
        const deal = await Deal.findOne({ dealOwner: { $in: ticket.owner } });
        if (deal) {
          ticket.associatedDealId = deal._id;
          associationsFixed++;
        } else {
          const company = await Company.findOne();
          if (company) {
            ticket.associatedCompanyId = company._id;
            associationsFixed++;
          }
        }
      }

      if (ticket.associatedDealId) {
        const deal = await Deal.findById(ticket.associatedDealId);
        if (deal && deal.email) emailToSet = deal.email;
      } else if (ticket.associatedCompanyId) {
        const company = await Company.findById(ticket.associatedCompanyId);
        if (company && company.email) emailToSet = company.email;
      }

      if (emailToSet && ticket.email !== emailToSet) {
        ticket.email = emailToSet;
        await ticket.save();
        syncedCount++;
      } else if (associationsFixed > 0) {
        // If we linked an orphan but email was already set or none found, still save the link
        await ticket.save();
      }
    }

    res.status(200).json({
      success: true,
      message: `Synced emails for ${syncedCount} tickets. Fixed connections for ${associationsFixed} tickets.`,
    });
  } catch (error) {
    console.error("SYNC TICKETS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};