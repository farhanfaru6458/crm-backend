import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorMiddleware.js";
import companyRoutes from "./routes/companyRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CRM Backend Running");
});

app.use("/api/companies", companyRoutes);

app.use(errorHandler);

export default app;
