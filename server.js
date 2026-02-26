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