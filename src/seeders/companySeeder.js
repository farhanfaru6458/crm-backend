import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Company from "../models/Company.js";

dotenv.config();
connectDB();

const companies = [
  {
    name: "TechNova Solutions",
    owner: "Farhan",
    phone: "9000011111",
    industry: "Technology",
    city: "Bangalore",
    country: "India",
    domain: "technova.com",
    type: "Client",
    employees: "50-100",
    revenue: "500000"
  },
  {
    name: "Maple Legal Group",
    owner: "Aisha",
    phone: "9000022222",
    industry: "Legal Services",
    city: "Toronto",
    country: "Canada",
    domain: "maplelegal.ca",
    type: "Partner",
    employees: "20-50",
    revenue: "200000"
  },
  {
    name: "HealthBridge Clinic",
    owner: "John",
    phone: "9000033333",
    industry: "Healthcare",
    city: "Amsterdam",
    country: "Netherlands",
    domain: "healthbridge.nl",
    type: "Client",
    employees: "100-200",
    revenue: "800000"
  },
  {
    name: "BluePeak Finance",
    owner: "Sophia",
    phone: "9000044444",
    industry: "Finance",
    city: "London",
    country: "UK",
    domain: "bluepeak.co.uk",
    type: "Vendor",
    employees: "200-500",
    revenue: "1200000"
  },
  {
    name: "UrbanNest Realty",
    owner: "David",
    phone: "9000055555",
    industry: "Real Estate",
    city: "Dubai",
    country: "UAE",
    domain: "urbannest.ae",
    type: "Client",
    employees: "50-100",
    revenue: "650000"
  },

  // Remaining 19 (Shortened Here For Clarity)
  {
    name: "Skyline Tech",
    owner: "Emma",
    phone: "9000066666",
    industry: "Technology",
    city: "San Francisco",
    country: "USA",
    domain: "skylinetech.com",
    type: "Client",
    employees: "100-200",
    revenue: "950000"
  },
  {
    name: "PrimeCare Health",
    owner: "Olivia",
    phone: "9000077777",
    industry: "Healthcare",
    city: "Sydney",
    country: "Australia",
    domain: "primecare.au",
    type: "Partner",
    employees: "50-100",
    revenue: "400000"
  },
  {
    name: "Atlas Infra",
    owner: "Noah",
    phone: "9000088888",
    industry: "Real Estate",
    city: "Mumbai",
    country: "India",
    domain: "atlasinfra.in",
    type: "Client",
    employees: "500-1000",
    revenue: "5000000"
  },
  {
    name: "FinCore Banking",
    owner: "Liam",
    phone: "9000099999",
    industry: "Finance",
    city: "Singapore",
    country: "Singapore",
    domain: "fincore.sg",
    type: "Vendor",
    employees: "200-500",
    revenue: "3000000"
  },
  {
    name: "GreenEarth Realty",
    owner: "Mia",
    phone: "9000100000",
    industry: "Real Estate",
    city: "Berlin",
    country: "Germany",
    domain: "greenearth.de",
    type: "Client",
    employees: "50-100",
    revenue: "750000"
  }
];

const importData = async () => {
  try {
    await Company.deleteMany(); //  Clears old data
    await Company.insertMany(companies);

    console.log(" Company Data Imported!");
    process.exit();
  } catch (error) {
    console.error(" Error:", error);
    process.exit(1);
  }
};

importData();