const { ObjectId } = require("mongodb");

class StatsService {
  constructor(client) {
    this.db = client.db();
    this.Book = this.db.collection("books");
    this.Reader = this.db.collection("readers");
    this.Borrow = this.db.collection("borrows");
  }

  // Helper: Tính ngày đầu tuần (Thứ 2) để thống kê theo tuần
  getStartOfWeek() {
    const now = new Date();
    const day = now.getDay(); 
    // Nếu là Chủ nhật (day=0) thì lùi 6 ngày, ngược lại lùi day-1 ngày để về Thứ 2
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); 
    const start = new Date(now.setDate(diff));
    start.setHours(0, 0, 0, 0);
    return start;
  }

  // 1. API cho Admin Dashboard (Tổng quan)
  async getOverview() {
    const startOfWeek = this.getStartOfWeek();

    const [
      totalBooks,
      totalReaders,
      totalBorrows,
      pendingBorrows,
      borrowedBorrows,
      returnedBorrows,
    ] = await Promise.all([
      this.Book.countDocuments({}),
      this.Reader.countDocuments({}),
      this.Borrow.countDocuments({}),
      this.Borrow.countDocuments({ status: "pending" }),
      this.Borrow.countDocuments({ status: "borrowed" }),
      this.Borrow.countDocuments({ status: "returned" }),
    ]);

    // Top sách mượn nhiều trong tuần cho Admin xem
    const topBooks = await this.getTopBorrowed(startOfWeek, 5);

    return {
      counts: {
        totalBooks,
        totalReaders,
        totalBorrows,
        pending: pendingBorrows,
        borrowed: borrowedBorrows,
        returned: returnedBorrows,
      },
      topBooks
    };
  }

  // 2. API Public cho Trang chủ (Lấy sách Trending) - ĐÂY LÀ HÀM BẠN ĐANG THIẾU
  async getTrendingBooks(limit = 8) {
    // Lấy thống kê từ đầu tuần
    const startOfWeek = this.getStartOfWeek();
    return await this.getTopBorrowed(startOfWeek, limit);
  }

  // Logic chung: Aggregation để đếm số lượt mượn
  async getTopBorrowed(fromDate, limit) {
    return await this.Borrow.aggregate([
      { 
        $match: { 
          // Chỉ lấy các phiếu mượn được tạo từ ngày 'fromDate' trở đi
          createdAt: { $gte: fromDate } 
        } 
      },
      { 
        // Nhóm theo mã sách và đếm số lượng
        $group: { 
          _id: "$maSach", 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } }, // Sắp xếp giảm dần (nhiều nhất lên đầu)
      { $limit: limit },        // Giới hạn số lượng
      {
        // Join với bảng 'books' để lấy thông tin chi tiết sách
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookInfo"
        }
      },
      { $unwind: "$bookInfo" }, // Gỡ mảng
      {
        // Chọn các trường cần thiết trả về
        $project: {
          _id: "$bookInfo._id",
          title: "$bookInfo.title",
          author: "$bookInfo.author",
          image: "$bookInfo.image",
          publishedYear: "$bookInfo.publishedYear",
          borrowCount: "$count" // Số lượt mượn
        }
      }
    ]).toArray();
  }
}

module.exports = StatsService;