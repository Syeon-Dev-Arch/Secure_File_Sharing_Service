import crypto from "crypto";
import fs from "fs";

export const encryptFile = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error("File path is required");
    }

    const fileBuffer = await fs.promises.readFile(filePath);
    // console.log(fileBuffer);

    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(12);

    // console.log(key);
    // console.log(iv);

    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

    const encryptedBuffer = Buffer.concat([
      cipher.update(fileBuffer),
      cipher.final(),
    ]);

    // console.log(encryptedBuffer);

    // checking the buffers
    // console.log(Buffer.isBuffer(encrypted));
    // console.log(Buffer.isBuffer(encrypted1));
    // console.log(Buffer.isBuffer(encryptedBuffer));
    // console.log("size of the filebuffer", fileBuffer.length);
    // console.log("size of the enceyptedbuffer", encryptedBuffer.length);

    // creating authTag - it prevents anf looks for that the data is not change during the data is stored
    const authTag = cipher.getAuthTag();

    return {
      encryptedBuffer,
      key,
      iv,
      authTag,
    };
  } catch (error) {
    console.error(error);
    throw new Error(`Encryption failed: ${error.message}`);
  }
};

export const decryptFile = async (filePath, key, iv, authTag) => {
  try {
    if (!filePath || !key || !iv || !authTag) {
      throw new Error("File path, key, iv and authTag are required");
    }

    const encryptedBuffer = await fs.promises.readFile(filePath);
    const keyBuffer = Buffer.from(key, "hex");
    const ivBuffer = Buffer.from(iv, "hex");
    const authTagBuffer = Buffer.from(authTag, "hex");

    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      keyBuffer,
      ivBuffer,
    );
    decipher.setAuthTag(authTagBuffer);
    const decrypted = Buffer.concat([
      decipher.update(encryptedBuffer),
      decipher.final(),
    ]);

    return { decrypted };
  } catch (error) {
    console.error(error);
    throw new Error(`Decryption failed: ${error.message}`);
  }
};
