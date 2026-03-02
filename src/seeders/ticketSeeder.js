import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Ticket from "../models/Ticket.js";
import Deal from "../models/Deal.js";
import Company from "../models/Company.js";
import User from "../models/User.js";

dotenv.config();
await connectDB();

const statuses = ["New", "Waiting on us", "Waiting on contact"];
const sources = ["Chat", "Email", "Phone"];
const priorities = ["High", "Medium", "Low"];
const owners = [
  "Jane Cooper",
  "Wade Warren",
  "Brooklyn Simmons",
  "Leslie Alexander",
];

const importData = async () => {
  try {
    await Ticket.deleteMany();

    const deals = await Deal.find();
    const companies = await Company.find();
    const user = await User.findOne();

    if (!user) {
      console.log("❌ No user found. Create user first.");
      process.exit();
    }

    const tickets = [];

    for (let i = 1; i <= 20; i++) {

      const linkToDeal = Math.random() > 0.5 && deals.length > 0;

      const randomDeal = linkToDeal
        ? deals[Math.floor(Math.random() * deals.length)]
        : null;

      const randomCompany = !linkToDeal && companies.length > 0
        ? companies[Math.floor(Math.random() * companies.length)]
        : null;

      tickets.push({
        ticketName: `Support Ticket ${i}`,
        description: "Customer reported an issue with CRM performance.",
        status: statuses[Math.floor(Math.random() * statuses.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        owner: owners[Math.floor(Math.random() * owners.length)],
        associatedDealId: randomDeal ? randomDeal._id : null,
        associatedCompanyId: randomCompany ? randomCompany._id : null,
        user: user._id,
      });
    }

    await Ticket.insertMany(tickets);

    console.log("20 Tickets Inserted Successfully");
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();