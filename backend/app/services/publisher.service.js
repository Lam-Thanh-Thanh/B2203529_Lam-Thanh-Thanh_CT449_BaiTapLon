const { ObjectId } = require("mongodb");

class PublisherService {
  constructor(client) {
    this.Publisher = client.db().collection("publishers");
  }

  extract(payload) {
    const d = {
      tenNXB: payload.tenNXB,
      diaChi: payload.diaChi,
    };
    // Xóa các trường undefined
    Object.keys(d).forEach((k) => d[k] === undefined && delete d[k]);
    return d;
  }

  async create(payload) {
    const doc = this.extract(payload);
    const result = await this.Publisher.insertOne({
      ...doc,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await this.findById(result.insertedId);
  }

  async findAll() {
    return await this.Publisher.find({}).sort({ tenNXB: 1 }).toArray();
  }

  async findById(id) {
    return await this.Publisher.findOne({ _id: new ObjectId(id) });
  }

  async update(id, payload) {
    const update = this.extract(payload);
    update.updatedAt = new Date();
    const result = await this.Publisher.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Publisher.findOneAndDelete({ _id: new ObjectId(id) });
    return result;
  }
}

module.exports = PublisherService;