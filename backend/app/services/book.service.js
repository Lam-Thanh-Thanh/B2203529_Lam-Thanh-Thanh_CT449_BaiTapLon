const { ObjectId } = require("mongodb");

class BookService {
  constructor(client) {
    this.Book = client.db().collection("books");
  }

extractBookData(payload) {
    const book = {
      title: payload.title,
      author: payload.author,
      // Dùng Number() để chuyển chuỗi thành số, nếu không có giá trị thì undefined
      price: payload.price ? Number(payload.price) : undefined,
      copies: payload.copies ? Number(payload.copies) : undefined, 
      publisher: payload.publisher,
      publishedYear: payload.publishedYear ? Number(payload.publishedYear) : undefined,
      // Nếu payload.tags là chuỗi (do FormData), cần tách mảng nếu cần (tùy logic bạn)
      image: payload.image,
      // [THÊM] Lưu mã NXB (ObjectId)
      maNXB: payload.maNXB ? new ObjectId(payload.maNXB) : undefined,
      // [THÊM] Lưu tên NXB (String) để dễ hiển thị mà không cần join bảng nhiều (tùy chọn)
      publisher: payload.publisherName,
    };

    // Xóa các trường undefined
    Object.keys(book).forEach(
      (k) => book[k] === undefined && delete book[k]
    );
    return book;
  }

  async create(payload) {
    const doc = this.extractBookData(payload);
    const result = await this.Book.insertOne({
      ...doc,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await this.findById(result.insertedId);
  }

  async findAll({ q }) {
    // q = text search theo title/author/publisher
    const filter = q
      ? {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { author: { $regex: q, $options: "i" } },
            { publisher: { $regex: q, $options: "i" } },
            { tags: { $elemMatch: { $regex: q, $options: "i" } } },
          ],
        }
      : {};
    return await this.Book.find(filter).sort({ createdAt: -1 }).toArray();
  }

  async findById(id) {
    return await this.Book.findOne({ _id: new ObjectId(id) });
  }

  async update(id, payload) {
    const update = this.extractBookData(payload);
    const result = await this.Book.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...update, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Book.findOneAndDelete({ _id: new ObjectId(id) });
    return result;
  }

  async deleteAll() {
    const result = await this.Book.deleteMany({});
    return { deletedCount: result.deletedCount };
  }
}

module.exports = BookService;