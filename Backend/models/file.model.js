import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const fileSchema = new mongoose.Schema(
  {
    shareId: {
      type: String,
      required: [true, "shareId is required"],
      unique: true,
    },

    originalName: {
      type: String,
      required: [true, "original Name is required"],
    },

    filePath: {
      type: String,
      required: [true, "file path is required"],
    },
    expire: {
      type: String,
      enum: ["1h", "24h", "7d", "30d"],
      required: [true, "expiry is required"],
    },
    expireAt: {
      type: Date,
      required: [true, "expiry at date is required"],
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    maxDownloadCount: {
      type: Number,
      default: 1,
    },
    password: {
      type: String,
      select: false,
    },
    authTag: {
      type: String,
      required: [true, "auth tag is required"],
    },
    key: {
      type: String,
      required: [true, "key is required"],
    },
    iv: {
      type: String,
      required: [true, "iv is required"],
    },
  },
  {
    timestamps: true,
  },
);

fileSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    this.password = await bcrypt.hash(this.password, 10);
    return;
  } catch (error) {
    return;
  }
});

fileSchema.methods.comparePassword = async function (cPass) {
  return await bcrypt.compare(cPass, this.password);
};

export const File = mongoose.model("File", fileSchema);
