import mongoose from "mongoose";
import dotenv from "dotenv";
import Lead from "../models/Lead.js";
import Deal from "../models/Deal.js";
import connectDB from "../config/db.js";

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const randomizeDates = async () => {
  try {
    await connectDB();

    const getRandomDate = (start, end) => {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };

    const startDate = new Date("2020-01-01");
    const endDate = new Date("2026-12-31");

    console.log("Randomizing Leads dates...");
    const leads = await Lead.find();
    for (const lead of leads) {
      const newDate = getRandomDate(startDate, endDate);
      
      // Update fields
      await Lead.updateOne(
        { _id: lead._id },
        { 
          $set: { 
            createdAt: newDate,
            updatedAt: newDate,
            createdDate: newDate.toLocaleDateString("en-GB")
          } 
        },
        { timestamps: false }
      );
    }
    console.log(`Updated ${leads.length} leads.`);

    console.log("Randomizing Deals data...");
    const deals = await Deal.find();
    const stages = [
      "Presentation Scheduled",
      "Qualified to Buy",
      "Contract Sent",
      "Appointment Scheduled",
      "Decision Maker Bought In",
      "Proposal Sent",
      "Negotiation",
      "Closed Won",
      "Closed Lost"
    ];

    for (const deal of deals) {
      const newDate = getRandomDate(startDate, endDate);
      const newStage = stages[Math.floor(Math.random() * stages.length)];
      
      // Update fields
      await Deal.updateOne(
        { _id: deal._id },
        { 
          $set: { 
            createdAt: newDate,
            updatedAt: newDate,
            closeDate: newDate.toISOString().split('T')[0],
            dealStage: newStage
          } 
        },
        { timestamps: false }
      );
    }
    console.log(`Updated ${deals.length} deals.`);

    console.log("Randomization complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error randomizing dates:", error);
    process.exit(1);
  }
};

randomizeDates();
