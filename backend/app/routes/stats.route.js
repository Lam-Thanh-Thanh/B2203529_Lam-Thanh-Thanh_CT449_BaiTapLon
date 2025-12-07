const express = require("express");
const { auth } = require("../middleware/auth");
const ctrl = require("../controllers/stats.controller");

const router = express.Router();

// Route công khai cho trang chủ (hoặc auth(['user']) nếu muốn bắt buộc login mới thấy)
// Tốt nhất để public để khách cũng thấy được độ hot
router.get("/trending", ctrl.trending);

// Route Admin (Giữ nguyên quyền Admin/Staff)
router.get("/", auth(["admin", "staff"]), ctrl.overview);

module.exports = router;