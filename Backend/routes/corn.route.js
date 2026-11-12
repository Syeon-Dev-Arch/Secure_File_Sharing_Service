import express from "express";
import { File } from "../models/file.model.js";
import fs from "fs";

const router = express.Router();

router.get("/cleanup", async (req, res) => {
  // Optional security check: verify a secret header so random people can't trigger it
  const authHeader = req.headers.authorization;
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const now = new Date();
    const files = await File.find({ expireAt: { $lt: now } });

    if (files.length === 0) {
      return res
        .status(200)
        .json({ message: "No files available for cleanup." });
    }

    for (const file of files) {
      if (fs.existsSync(file.filePath)) {
        await fs.promises.unlink(file.filePath);
      }
    }

    const expiredIds = files.map((file) => file._id);
    await File.deleteMany({ _id: { $in: expiredIds } });

    return res.status(200).json({
      success: true,
      message: `Successfully cleaned up ${expiredIds.length} expired files`,
    });
  } catch (error) {
    console.error("Error during cron cleanup:", error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
