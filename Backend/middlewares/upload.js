import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMulter = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "video/mp4",
  ];

  if (allowedMulter.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error("Invalid file type");
    error.status = 400;
    cb(error, false);
  }
};

export const upload = multer({
  storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});
