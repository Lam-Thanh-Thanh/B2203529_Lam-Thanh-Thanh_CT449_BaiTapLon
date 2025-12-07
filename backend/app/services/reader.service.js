const { ObjectId } = require("mongodb");

class ReaderService {
  constructor(client) {
    this.Reader = client.db().collection("readers");
  }

  extract(payload) {
    const d = {
      hoLot: payload.hoLot,
      ten: payload.ten,
      ngaySinh: payload.ngaySinh ? new Date(payload.ngaySinh) : undefined,
      phai: payload.phai,
      diaChi: payload.diaChi,
      dienThoai: payload.dienThoai,
    };
    Object.keys(d).forEach((k) => d[k] === undefined && delete d[k]);
    return d;
  }

  async create(payload) {
    const doc = this.extract(payload);
    const r = await this.Reader.insertOne({
      ...doc,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await this.findById(r.insertedId);
  }

  async findAll() {
    return await this.Reader.find({}).toArray();
  }

  async findById(id) {
    return await this.Reader.findOne({ _id: new ObjectId(id) });
  }

  async update(id, payload) {
    const update = this.extract(payload);
    update.updatedAt = new Date();
    const result = await this.Reader.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" }
    );
    return result.value;
  }

  // 1. Thêm sách vào danh sách yêu thích
  async addFavorite(readerId, bookId) {
    // $addToSet: chỉ thêm nếu chưa có (tránh trùng lặp)
    const result = await this.Reader.updateOne(
      { _id: new ObjectId(readerId) },
      { $addToSet: { favorites: new ObjectId(bookId) } }
    );
    return result;
  }

  // 2. Xóa sách khỏi danh sách yêu thích
  async removeFavorite(readerId, bookId) {
    const result = await this.Reader.updateOne(
      { _id: new ObjectId(readerId) },
      { $pull: { favorites: new ObjectId(bookId) } }
    );
    return result;
  }

  // 3. Lấy danh sách sách yêu thích (kèm thông tin chi tiết sách)
  async getFavorites(readerId) {
    const pipeline = [
      { $match: { _id: new ObjectId(readerId) } },
      { $project: { favorites: 1 } },
      { $unwind: { path: "$favorites", preserveNullAndEmptyArrays: false } },
      // Join với bảng Books
      {
        $lookup: {
          from: "books",
          localField: "favorites",
          foreignField: "_id",
          as: "bookInfo"
        }
      },
      { $unwind: "$bookInfo" },
      {
        $project: {
          _id: "$bookInfo._id",
          title: "$bookInfo.title",
          author: "$bookInfo.author",
          image: "$bookInfo.image",
          copies: "$bookInfo.copies",
          publishedYear: "$bookInfo.publishedYear"
        }
      }
    ];
    return await this.Reader.aggregate(pipeline).toArray();
  }
}

module.exports = ReaderService;
