// app/controllers/borrow.controller.js
const MongoDB = require("../utils/mongodb.util");
const BorrowService = require("../services/borrow.service");

const svc = () => new BorrowService(MongoDB.getClient());

exports.create = async (req, res, next) => {
  try {
    // maDocGia lấy từ user đang đăng nhập
    if (!req.user?.readerId) {
      return res.status(400).json({ message: "User has no reader profile" });
    }
    const data = {
      maSach: req.body.maSach,
      maDocGia: req.user.readerId,
    };
    const created = await svc().create(data);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
};

// app/controllers/borrow.controller.js
exports.findAll = async (req, res, next) => {
  try {
    const { status, maDocGia: maDocGiaQuery } = req.query;

    const filter = { status };

    // Nếu là user thường -> chỉ cho xem lịch sử của chính mình
    if (req.user.role === "user") {
      const maDocGia = req.user.readerId;
      // Không có hồ sơ độc giả thì coi như không có lịch sử => trả mảng rỗng
      if (!maDocGia) {
        return res.json([]);
      }
      filter.maDocGia = maDocGia;
    }

    // Nếu là admin -> cho phép xem tất cả,
    // hoặc lọc theo maDocGia nếu phía client gửi lên
    if (req.user.role === "admin") {
      if (maDocGiaQuery) {
        filter.maDocGia = maDocGiaQuery;
      }
    }

    const data = await svc().findAll(filter);
    res.json(data);
  } catch (e) {
    next(e);
  }
};


exports.findOne = async (req, res, next) => {
  try {
    const data = await svc().findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Borrow not found" });
    res.json(data);
  } catch (e) { next(e); }
};

exports.approve = async (req, res, next) => {
  try {
    // Lấy ID của admin đang đăng nhập làm msnv
    const staffId = req.user.id; 
    const data = await svc().approve(req.params.id, { msnv: staffId });
    res.json(data);
  } catch (e) { next(e); }
};

exports.markBorrowed = async (req, res, next) => {
  try {
    // Khi đánh dấu đã mượn, cũng cập nhật người xử lý (người giao sách)
    const staffId = req.user.id;
    const data = await svc().markBorrowed(req.params.id, staffId);
    res.json(data);
  } catch (e) { next(e); }
};

exports.markReturned = async (req, res, next) => {
  try {
    // Khi trả sách, cũng có thể lưu người nhận sách (nếu muốn mở rộng sau này)
    const staffId = req.user.id;
    const data = await svc().markReturned(req.params.id, staffId);
    res.json(data);
  } catch (e) { next(e); }
};