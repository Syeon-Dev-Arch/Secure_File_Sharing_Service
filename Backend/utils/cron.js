import cron from "node-cron";
import { File } from "../models/file.model.js";
import fs from "fs";

const cronDelete = async () => {
  try {
    const now = new Date();

    const files = await File.find({
      expireAt: { $lt: now },
    });

    if (files.length === 0) {
      console.log(`No file Available for clean up ${files.length}`);
      return;
    }

    for (const file of files) {
      if (fs.existsSync(file.filePath)) {
        await fs.promises.unlink(file.filePath);
      }
    }

    const expiredIds = files.map((file) => file._id);
    await File.deleteMany({ _id: { $in: expiredIds } });
    console.log(`Successfully cleaned up ${expiredIds.length} expired files`);
  } catch (error) {
    console.log(error);
    console.log("Something went wrong while cron job", error);
  }
};

cron.schedule("* * * * *", () => {
  cronDelete();
});
