const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Đường dẫn này đi từ: backend/app/middleware -> ra backend/app -> ra backend -> vào public/uploads
    // Nếu bạn đặt file upload.js ở vị trí khác, hãy chỉnh lại đường dẫn này
    cb(null, path.join(__dirname, "../../public/uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
module.exports = upload;