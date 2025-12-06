const { ObjectId } = require("mongodb");

class BorrowService {
  constructor(client) {
    this.Borrow = client.db().collection("borrows");
    this.Book = client.db().collection("books");
    this.Reader = client.db().collection("readers");
    this.User = client.db().collection("users");
  }

  extractBorrowData(payload) {
    const doc = {
      maDocGia: payload.maDocGia ? new ObjectId(payload.maDocGia) : undefined,
      maSach: payload.maSach ? new ObjectId(payload.maSach) : undefined,
      status: payload.status,
      ngayMuon: payload.ngayMuon ? new Date(payload.ngayMuon) : undefined,
      ngayTra: payload.ngayTra ? new Date(payload.ngayTra) : undefined,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
      msnv: payload.msnv ? new ObjectId(payload.msnv) : undefined,
    };
    Object.keys(doc).forEach((k) => doc[k] === undefined && delete doc[k]);
    return doc;
  }

  async _assertReaderAndBook(maDocGia, maSach) {
    const [reader, book] = await Promise.all([
      this.Reader.findOne({ _id: new ObjectId(maDocGia) }),
      this.Book.findOne({ _id: new ObjectId(maSach) }),
    ]);
    if (!reader) throw new Error("Reader not found");
    if (!book) throw new Error("Book not found");
    return { reader, book };
  }

  // tạo yêu cầu mượn (pending)
  async create(payload) {
    const { maDocGia, maSach } = payload;
    await this._assertReaderAndBook(maDocGia, maSach);

    const doc = {
      ...this.extractBorrowData(payload),
      status: "pending",
      ngayMuon: null,
      ngayTra: null,
      dueDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await this.Borrow.insertOne(doc);
    return await this.findById(result.insertedId);
  }

  async findAll({ status, maDocGia } = {}) {
    const filter = {};
    if (status) filter.status = status;
    
    // FIX: Đảm bảo chuyển string sang ObjectId
    if (maDocGia) {
        try {
            filter.maDocGia = new ObjectId(maDocGia);
        } catch (e) {
            // Nếu maDocGia gửi lên không đúng định dạng ObjectId -> trả về rỗng luôn
            return [];
        }
    }

    const pipeline = [
      { $match: filter },
      { $sort: { createdAt: -1 } },
      // Join Reader
      {
        $lookup: {
          from: "readers",
          localField: "maDocGia",
          foreignField: "_id",
          as: "readerDetail",
        },
      },
      { $unwind: { path: "$readerDetail", preserveNullAndEmptyArrays: true } },
      // Join Book
      {
        $lookup: {
          from: "books",
          localField: "maSach",
          foreignField: "_id",
          as: "bookDetail",
        },
      },
      { $unwind: { path: "$bookDetail", preserveNullAndEmptyArrays: true } },
      // Join Staff (User)
      {
        $lookup: {
          from: "users",
          localField: "msnv",
          foreignField: "_id",
          as: "staffDetail",
        },
      },
      { $unwind: { path: "$staffDetail", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          status: 1,
          ngayMuon: 1,
          ngayTra: 1,
          dueDate: 1,
          createdAt: 1,
          maDocGia: 1,
          // Lấy thông tin hiển thị
          readerName: { $concat: ["$readerDetail.hoLot", " ", "$readerDetail.ten"] },
          bookTitle: "$bookDetail.title",
          bookImage: "$bookDetail.image", // Cần lấy ảnh để hiển thị đẹp
          staffName: "$staffDetail.username",
        },
      },
    ];

    return await this.Borrow.aggregate(pipeline).toArray();
  }

  async findById(id) {
    return await this.Borrow.findOne({ _id: new ObjectId(id) });
  }

  // Cập nhật người duyệt (msnv)
  async approve(id, { msnv }) {
    const result = await this.Borrow.findOneAndUpdate(
      { _id: new ObjectId(id), status: "pending" },
      {
        $set: {
          status: "approved",
          msnv: msnv ? new ObjectId(msnv) : null, // Lưu ID của admin
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!result) {
      throw new Error("Borrow not found or not in 'pending'");
    }

    return result;
  }


  // Cập nhật người giao sách (msnv) nếu chưa có
  async markBorrowed(id, staffId) {
    const borrow = await this.findById(id);
    if (!borrow) throw new Error("Borrow not found");
    if (!["approved", "pending"].includes(borrow.status)) {
      throw new Error("Invalid state transition to 'borrowed'");
    }

    // Logic kiểm tra số sách, quá hạn... (Giữ nguyên logic cũ của bạn)
    const maxBorrow = 3;
    const currentBorrowing = await this.Borrow.countDocuments({
      maDocGia: borrow.maDocGia,
      status: "borrowed",
    });
    if (currentBorrowing >= maxBorrow) {
      throw new Error("Reader has reached maximum borrowed books");
    }

    const now = new Date();
    // Logic trừ copies sách (Giữ nguyên logic cũ)
    const book = await this.Book.findOne({ _id: borrow.maSach });
    if (!book || book.copies <= 0) throw new Error("No copies available");
    
    await this.Book.updateOne(
        { _id: borrow.maSach }, 
        { $inc: { copies: -1 } }
    );

    const dueDays = 14; 
    const dueDate = new Date(now.getTime() + dueDays * 24 * 60 * 60 * 1000);

    const updateData = {
      status: "borrowed",
      ngayMuon: now,
      dueDate,
      updatedAt: now,
    };
    
    // Nếu chưa có msnv (duyệt thẳng từ pending -> borrowed), gán người đang thao tác
    // Hoặc ghi đè người thực hiện giao sách
    if (staffId) {
        updateData.msnv = new ObjectId(staffId);
    }

    const result = await this.Borrow.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );
    return result;
  }

  // xác nhận đã trả -> returned (cộng copies)
  async markReturned(id) {
    const borrow = await this.findById(id);
    if (!borrow) throw new Error("Borrow not found");
    if (borrow.status !== "borrowed") {
      throw new Error("Only 'borrowed' can be returned");
    }

    await this.Book.updateOne(
      { _id: borrow.maSach },
      { $inc: { copies: 1 } }
    );

    const now = new Date();
    const result = await this.Borrow.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "returned",
          ngayTra: now,
          updatedAt: now,
        },
      },
      { returnDocument: "after" }
    );
    return result;
  }
}

module.exports = BorrowService;
