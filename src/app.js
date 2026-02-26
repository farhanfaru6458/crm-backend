import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorMiddleware.js";
import leadRoutes from "./routes/leadRoutes.js";
import dealRoutes from "./routes/dealRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import callRoutes from "./routes/callRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/leads", leadRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/calls", callRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/meetings", meetingRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("CRM Backend Running");
});

app.use("/api/companies", companyRoutes);

app.use(errorHandler);

export default app;
