import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;
const HOST = "http://localhost";

app.listen(PORT, () => {
  console.log("========================================");
  console.log(`Server running at: ${HOST}:${PORT}/api`);
  console.log("========================================");
});


// ================================================================================
// to implement data in terminal type node src/seeders/companySeeder.js         === 
// to implement data in terminal type node src/seeders/dealSeeder.js            === 
// to implement data in terminal type node src/seeders/leadSeeder.js            === 
// to implement data in terminal type node src/seeders/ticketSeeder.js          === 
// ================================================================================
// ================================================================================
// ADD THIS INTO THE .env file to otp to work
// PORT=5000
// MONGO_URI=mongodb://localhost:27017/crm_db
// JWT_SECRET=crm_backend_c
// EMAIL_USER=crmc6551@gmail.com
// EMAIL_PASS=rdphdhxmmltrhhnp