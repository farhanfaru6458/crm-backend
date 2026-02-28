import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Lead from "../models/Lead.js";

dotenv.config();
await connectDB();

const statuses = [
  "Contacted",
  "Qualified",
  "Unqualified",
  "Converted",
  "New",
  "In Progress",
];

const owners = [
  "Jane Cooper",
  "Wade Warren",
  "Brooklyn Simmons",
  "Leslie Alexander",
];

const leads = [];

for (let year = 2020; year <= 2026; year++) {
  for (let month = 0; month < 12; month++) {
    for (let i = 1; i <= 3; i++) {
      leads.push({
        name: `Lead ${year}-${month + 1}-${i}`,
        email: `lead${year}${month}${i}@crm.com`,
        phone: `98765${year}${month}${i}`,
        company: `Company ${i}`,
        jobTitle: "Manager",
        status: statuses[Math.floor(Math.random() * statuses.length)],
        owner: [owners[Math.floor(Math.random() * owners.length)]],
        city: "Bangalore",
        country: "India",
        createdAt: new Date(year, month, 10),
      });
    }
  }
}

const importData = async () => {
  try {
    await Lead.deleteMany();
    await Lead.insertMany(leads);
    console.log("🔥 Multi-Year Leads Inserted (2020–2026)");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();