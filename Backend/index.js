import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import fileRoutes from "./routes/file.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import "./utils/cron.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
connectDB();

app.use(cors());

app.use("/api/files", fileRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
