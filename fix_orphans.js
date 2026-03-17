import mongoose from "mongoose";
import Ticket from "./src/models/Ticket.js";
import Deal from "./src/models/Deal.js";
import Company from "./src/models/Company.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/crm_db";

const fixOrphanTickets = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected for orphan ticket fix...");

    // 1. Target the specific ticket from your screenshot
    const targetId = "69ad3295015e630ce902cd68"; // From screenshot URL/data
    const targetTicket = await Ticket.findById(targetId);
    
    if (targetTicket) {
      console.log(`Found target ticket: ${targetTicket.ticketName}`);
      // Find a deal owned by the same person
      const deal = await Deal.findOne({ dealOwner: { $in: targetTicket.owner } });
      if (deal) {
        targetTicket.associatedDealId = deal._id;
        targetTicket.email = deal.email || "";
        await targetTicket.save();
        console.log(`Linked target ticket to deal: ${deal.dealName} (${deal.email})`);
      }
    }

    // 2. Fix all other orphan tickets by linking to a deal/company by owner
    const orphans = await Ticket.find({ 
      associatedDealId: null, 
      associatedCompanyId: null 
    });

    console.log(`Found ${orphans.length} other orphan tickets. Syncing backend connections...`);
    
    let count = 0;
    for (const orphan of orphans) {
      const deal = await Deal.findOne({ dealOwner: { $in: orphan.owner } });
      if (deal) {
        orphan.associatedDealId = deal._id;
        orphan.email = deal.email || "";
        await orphan.save();
        count++;
      } else {
        const company = await Company.findOne(); // Fallback to any company if no specific deal
        if (company) {
          orphan.associatedCompanyId = company._id;
          orphan.email = company.email || "";
          await orphan.save();
          count++;
        }
      }
    }

    console.log(`Successfully connected ${count} orphan tickets in the backend.`);
    process.exit(0);
  } catch (err) {
    console.error("Fix failed:", err);
    process.exit(1);
  }
};

fixOrphanTickets();
