import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import fileRoutes from "./routes/file.routes.js";
import cronRoutes from "./routes/corn.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import "./utils/cron.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
connectDB();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://secure-file-sharing-service-d7cu-3qtule2ul-syeon1.vercel.app",
    ],
    credentials: true,
  }),
);

app.use("/api/files", fileRoutes);
app.use("/api/cron", cronRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
