const { ObjectId } = require("mongodb");

class StaffService {
  constructor(client) {
    this.Staff = client.db().collection("staff"); // bảng NhanVien
  }

  extract(payload) {
    const d = {
      hoLot: payload.hoLot,
      ten: payload.ten,
      phai: payload.phai,
      diaChi: payload.diaChi,
      dienThoai: payload.dienThoai,
    };
    Object.keys(d).forEach((k) => d[k] === undefined && delete d[k]);
    return d;
  }

  async create(payload) {
    const doc = this.extract(payload);
    const now = new Date();
    const r = await this.Staff.insertOne({
      ...doc,
      createdAt: now,
      updatedAt: now,
    });
    return await this.findById(r.insertedId);
  }

  async findAll() {
    return await this.Staff.find({}).sort({ createdAt: -1 }).toArray();
  }

  async findById(id) {
    return await this.Staff.findOne({ _id: new ObjectId(id) });
  }

  async update(id, payload) {
    const update = this.extract(payload);
    update.updatedAt = new Date();
    await this.Staff.updateOne({ _id: new ObjectId(id) }, { $set: update });
    return await this.findById(id);
  }

  async delete(id) {
    const result = await this.Staff.deleteOne({ _id: new ObjectId(id) });
    return result;
  }
}

module.exports = StaffService;
