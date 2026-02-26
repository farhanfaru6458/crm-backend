import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";



const app = express();

app.use(cors());
app.use(express.json());
app.use(errorHandler);
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("CRM Backend Running");
});

export default app;