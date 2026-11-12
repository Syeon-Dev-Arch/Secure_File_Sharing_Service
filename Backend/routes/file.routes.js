import express from "express";
import { upload } from "../middlewares/upload.js";
import {
  getFile,
  uploadFile,
  getFileInfo,
} from "../controllers/file.controller.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadFile);
router.post("/download/:shareId", getFile);
router.get("/info/:shareId", getFileInfo);

export default router;
