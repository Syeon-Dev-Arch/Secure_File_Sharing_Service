import { v4 as uuidv4 } from "uuid";
import { File } from "../models/file.model.js";
import { encryptFile, decryptFile } from "../utils/encryption.js";
import fs from "fs";
import path from "path";

export const uploadFile = async (req, res) => {
  try {
    // Grabing inputs
    const { expire, maxDownloadCount, password } = req.body;
    const maxDownload = Number(maxDownloadCount);

    // checking for the file
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "File is not found" });
    }

    // contion check for maxDownload
    if (isNaN(maxDownload) || maxDownload <= 0) {
      return res.status(400).json({
        success: false,
        message: "Max download count must be a positive number",
      });
    }

    console.log(expire, maxDownload, password);

    // expirymap
    const expiryMap = {
      "1h": 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
    };

    // contion check for expiry date
    if (!expire || !expiryMap[expire]) {
      return res.status(400).json({
        success: false,
        message: "Expiry date is not valid, please choose a vaild expiry date",
      });
    }

    // creating the date
    const expireAt = new Date(Date.now() + expiryMap[expire]);

    console.log(expireAt);

    // File protection
    const { encryptedBuffer, key, iv, authTag } = await encryptFile(
      req.file.path,
    );

    if (!encryptedBuffer || !key || !iv || !authTag) {
      return res.status(500).json({
        success: false,
        message: "Failed to encrypt the file",
      });
    }

    // writing the encrypted file back to disk
    await fs.promises.writeFile(req.file.path, encryptedBuffer);

    // creating a shareable id of file
    const shareId = uuidv4();

    // Saving the file on db
    const file = await File.create({
      shareId,
      originalName: req.file.originalname,
      filePath: req.file.path,
      expire,
      expireAt,
      downloadCount: 0,
      maxDownloadCount: maxDownload,
      password: password || undefined,
      authTag: authTag.toString("hex"),
      key: key.toString("hex"),
      iv: iv.toString("hex"),
    });

    // sending response
    res.status(201).json({
      success: true,
      fileData: {
        name: req.file.originalname,
        shareId,
        downloadingLink: `${process.env.FRONTEND_URL}/download/${shareId}`,
        expireDate: expireAt,
        downloadCount: file.downloadCount,
        maxDownload,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const getFile = async (req, res) => {
  try {
    const file = await File.findOne({ shareId: req.params.shareId }).select(
      "+password",
    );

    if (!file || !fs.existsSync(file.filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    if (Date.now() > file.expireAt.getTime()) {
      return res.status(410).json({
        message: "File has expired",
      });
    }

    if (file.downloadCount >= file.maxDownloadCount) {
      return res.status(410).json({
        message: "Maximum download limit reached",
      });
    }
    if (file.password) {
      const { inputpassword } = req.body;

      if (!inputpassword || !inputpassword.trim()) {
        return res.status(401).json({
          success: false,
          message: "Not provided password",
        });
      }
      const isMatch = await file.comparePassword(inputpassword);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Incorrect password",
        });
      }
    }

    // Decrypting the file
    const { decrypted } = await decryptFile(
      file.filePath,
      file.key,
      file.iv,
      file.authTag,
    );

    if (!decrypted) {
      return res.status(500).json({
        success: false,
        message: "Failed to decrypt the file",
      });
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.originalName}"`,
    );

    res.on("finish", async () => {
      file.downloadCount++;
      await file.save();
    });

    res.send(decrypted);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

// get file info

export const getFileInfo = async (req, res) => {
  try {
    const file = await File.findOne({
      shareId: req.params.shareId,
    }).select("+password");

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    return res.status(200).json({
      success: true,
      file: {
        originalName: file.originalName,
        expireAt: file.expireAt,
        downloadCount: file.downloadCount,
        maxDownloadCount: file.maxDownloadCount,
        passwordProtected: !!file.password,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};
