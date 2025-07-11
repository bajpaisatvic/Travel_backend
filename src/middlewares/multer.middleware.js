import multer from "multer";
import fs from "fs";

// Ensure 'public' folder exists
if (!fs.existsSync("./public")) {
  fs.mkdirSync("./public");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public");
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });
