// app/services/stats.service.js
const { ObjectId } = require("mongodb");

class StatsService {
  constructor(client) {
    this.db = client.db();
    this.Book = this.db.collection("books");
    this.Reader = this.db.collection("readers");
    this.Borrow = this.db.collection("borrows");
  }

  async getOverview() {
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
    // --- LOGIC MỚI: Top 5 sách mượn nhiều nhất tháng này ---
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const topBooks = await this.Borrow.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startOfMonth } // Lọc phiếu tạo trong tháng
        } 
      },
      { 
        $group: { 
          _id: "$maSach", 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } }, // Sắp xếp giảm dần
      { $limit: 5 }, // Lấy top 5
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookInfo"
        }
      },
      { $unwind: "$bookInfo" },
      {
        $project: {
          title: "$bookInfo.title",
          image: "$bookInfo.image",
          count: 1
        }
      }
    ]).toArray();
    return {
      counts: { // Gom các số liệu đếm vào 1 object cho gọn
        totalBooks,
        totalReaders,
        totalBorrows,
        pendingBorrows,
        borrowedBorrows,
        returnedBorrows,
      },
      topBooks
    };
  }
}

module.exports = StatsService;
