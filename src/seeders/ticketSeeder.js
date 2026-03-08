import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Ticket from "../models/Ticket.js";
import Deal from "../models/Deal.js";
import Company from "../models/Company.js";

dotenv.config();

const tickets = [
  {
    ticketName: "Issue with Login",
    description: "User unable to login with correct credentials.",
    status: "New",
    source: "Email",
    priority: "High",
    owner: "Jane Cooper",
  },
  {
    ticketName: "Dashboard Loading Slow",
    description: "The dashboard takes more than 10 seconds to load.",
    status: "Waiting on us",
    source: "Phone",
    priority: "Medium",
    owner: "Wade Warren",
  },
  {
    ticketName: "Feature Request: Export Leads",
    description: "Customer wants to export leads to CSV format.",
    status: "New",
    source: "Chat",
    priority: "Low",
    owner: "Brooklyn Simmons",
  },
  {
    ticketName: "Missing Data in Reports",
    description: "Reports are not showing the latest deals.",
    status: "Waiting on contact",
    source: "Email",
    priority: "High",
    owner: "Leslie Alexander",
  },
  {
    ticketName: "Payment Gateway Error",
    description: "Users getting 500 error on payment page.",
    status: "New",
    source: "Phone",
    priority: "High",
    owner: "Jane Cooper",
  },
  {
    ticketName: "Mobile App Crash",
    description: "App crashes when opening ticket details.",
    status: "Waiting on us",
    source: "Chat",
    priority: "Medium",
    owner: "Wade Warren",
  },
  {
    ticketName: "Update Documentation",
    description: "The API documentation is outdated.",
    status: "New",
    source: "Email",
    priority: "Low",
    owner: "Brooklyn Simmons",
  },
  {
    ticketName: "UI Alignment Issue",
    description: "Button is not aligned on the settings page.",
    status: "Waiting on contact",
    source: "Chat",
    priority: "Low",
    owner: "Leslie Alexander",
  },
  {
    ticketName: "Security Vulnerability",
    description: "Potential XSS found in comments section.",
    status: "New",
    source: "Email",
    priority: "High",
    owner: "Jane Cooper",
  },
  {
    ticketName: "Broken Links in Footer",
    description: "The 'Privacy Policy' link is broken.",
    status: "Waiting on us",
    source: "Chat",
    priority: "Low",
    owner: "Wade Warren",
  }
];

const importData = async () => {
  try {
    await connectDB();
    
    // We optionally link some tickets to existing deals or companies if they exist
    const deals = await Deal.find();
    const companies = await Company.find();

    const finalTickets = tickets.map((t, index) => {
        const enhancedTicket = { ...t };
        if (index === 0 && deals.length > 0) enhancedTicket.associatedDealId = deals[0]._id;
        if (index === 1 && companies.length > 0) enhancedTicket.associatedCompanyId = companies[0]._id;
        return enhancedTicket;
    });

    await Ticket.deleteMany(); // Clear old data for a fresh seed
    await Ticket.insertMany(finalTickets);

    console.log("Ticket Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

importData();