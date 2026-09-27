import multer from "multer";
import path from "path";
import fs from "fs";
import os from "os";

// روی Vercel فقط پوشه‌ی /tmp قابل نوشتنه، بقیه‌ی دیسک read-only هست
const uploadDir = process.env.VERCEL
  ? path.join(os.tmpdir(), "contracts")
  : "uploads/contracts";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "contract-" + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("فقط فایل‌های PDF و تصاویر مجاز هستند"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

export const uploadContractFile = upload.single("contractFile");