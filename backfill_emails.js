import mongoose from "mongoose";
import Lead from "./src/models/Lead.js";
import Deal from "./src/models/Deal.js";
import Ticket from "./src/models/Ticket.js";
import Company from "./src/models/Company.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/crm-live";

const backfill = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for backfill...");

    // 1. Sync Deals with Leads
    const deals = await Deal.find({ associatedLeadId: { $ne: null } });
    console.log(`Found ${deals.length} deals to check.`);
    let dealsUpdated = 0;
    for (const deal of deals) {
      const lead = await Lead.findById(deal.associatedLeadId);
      if (lead && lead.email && deal.email !== lead.email) {
        await Deal.findByIdAndUpdate(deal._id, { email: lead.email });
        dealsUpdated++;
      }
    }
    console.log(`Updated ${dealsUpdated} deals.`);

    // 2. Sync Tickets with Deals/Companies
    const tickets = await Ticket.find({
      $or: [
        { associatedDealId: { $ne: null } },
        { associatedCompanyId: { $ne: null } }
      ]
    });
    console.log(`Found ${tickets.length} tickets to check.`);
    let ticketsUpdated = 0;
    for (const ticket of tickets) {
      let emailToSet = "";
      if (ticket.associatedDealId) {
        const deal = await Deal.findById(ticket.associatedDealId);
        if (deal && deal.email) emailToSet = deal.email;
      } else if (ticket.associatedCompanyId) {
        const company = await Company.findById(ticket.associatedCompanyId);
        if (company && company.email) emailToSet = company.email;
      }

      if (emailToSet && ticket.email !== emailToSet) {
        await Ticket.findByIdAndUpdate(ticket._id, { email: emailToSet });
        ticketsUpdated++;
      }
    }
    console.log(`Updated ${ticketsUpdated} tickets.`);

    console.log("Backfill completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Backfill failed:", err);
    process.exit(1);
  }
};

backfill();
