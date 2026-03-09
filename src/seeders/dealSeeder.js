// src/seeders/dealSeeder.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Deal from "../models/Deal.js";
import Lead from "../models/Lead.js";

dotenv.config();
await connectDB();

const stages = [
  "Presentation Scheduled",
  "Qualified to Buy",
  "Contract Sent",
  "Appointment Scheduled",
  "Decision Maker Bought In",
  "Closed Won",
  "Closed Lost",
];

const years = [2020,2021,2022,2023,2024,2025,2026];

const importData = async () => {
  try {
    await Deal.deleteMany();
    const leads = await Lead.find();

    const deals = [];

    years.forEach(year => {
      for (let month = 0; month < 12; month++) {
        // Stop seeding if we reach the future (current month is March 2026)
        if (year === 2026 && month > 2) break;

        const monthlyDeals = 6 + Math.floor(Math.random() * 5);

        for (let i = 0; i < monthlyDeals; i++) {
          const randomLead =
            leads[Math.floor(Math.random() * leads.length)];

          deals.push({
            dealName: `Enterprise ${year}-${month+1}-${i}`,
            dealStage: stages[Math.floor(Math.random() * stages.length)],
            amount: 5000 + Math.floor(Math.random() * (year - 2019) * 20000),
            dealOwner: "Jane Cooper",
            closeDate: new Date(year, month, 15),
            priority: ["High","Medium","Low"][Math.floor(Math.random()*3)],
            associatedLeadId: randomLead._id,
            createdAt: new Date(year, month, 5),
          });
        }
      }
    });

    await Deal.insertMany(deals);

    console.log("Multi-Year Deals Inserted (2020–2026)");
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();