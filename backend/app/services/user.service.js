const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

class UserService {
  constructor(client) {
    this.db = client.db();
    this.User = this.db.collection("users");
    this.Reader = this.db.collection("readers");
    this.Staff = this.db.collection("staff"); // Bảng NhanVien
  }

  extract(data) {
    const doc = {
      username: data.username,
      password: data.password,
      role: data.role || "user",
      readerId: data.readerId ? new ObjectId(data.readerId) : undefined,
      staffId: data.staffId ? new ObjectId(data.staffId) : undefined, // [THÊM]
      updatedAt: new Date(), // [THÊM] Để tracking lần hoạt động cuối
    };
    // Chỉ hash password nếu có gửi lên
    // (Logic hash sẽ xử lý ở hàm update/register, ở đây chỉ extract)
    
    Object.keys(doc).forEach((k) => doc[k] === undefined && delete doc[k]);
    return doc;
  }

  async register(data) {
    const doc = this.extract(data);
    const exists = await this.User.findOne({ username: doc.username });
    if (exists) throw new Error("Username already exists");

    // Logic tạo Reader tự động cho user thường (giữ nguyên)
    let readerId = doc.readerId;
    if (!readerId && doc.role === "user") {
      const readerDoc = {
        hoLot: data.hoLot || "",
        ten: data.ten || doc.username,
        phai: "", diaChi: "", dienThoai: data.dienThoai || "",
        createdAt: new Date(), updatedAt: new Date(),
      };
      const r = await this.Reader.insertOne(readerDoc);
      readerId = r.insertedId;
    }

    const hashed = await bcrypt.hash(doc.password, 10);
    const insertData = {
      username: doc.username,
      password: hashed,
      role: doc.role,
      readerId: readerId,
      staffId: doc.staffId ? new ObjectId(doc.staffId) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.User.insertOne(insertData);
    return await this.User.findOne({ _id: result.insertedId });
  }

  async login(username, password) {
    const user = await this.User.findOne({ username });
    if (!user) throw new Error("Invalid username or password");
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid username or password");
    
    // Cập nhật thời gian hoạt động cuối khi login
    await this.User.updateOne(
        { _id: user._id }, 
        { $set: { updatedAt: new Date() } }
    );
    
    return user;
  }

  async findById(id) {
    return await this.User.findOne({ _id: new ObjectId(id) });
  }

  // [SỬA LẠI] Dùng Aggregate để lấy tên người dùng từ bảng Reader hoặc Staff
  async findAll() {
    const pipeline = [
      // Join với Reader
      {
        $lookup: {
          from: "readers",
          localField: "readerId",
          foreignField: "_id",
          as: "readerInfo",
        },
      },
      { $unwind: { path: "$readerInfo", preserveNullAndEmptyArrays: true } },
      
      // Join với Staff
      {
        $lookup: {
          from: "staff",
          localField: "staffId",
          foreignField: "_id",
          as: "staffInfo",
        },
      },
      { $unwind: { path: "$staffInfo", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: 1,
          username: 1,
          role: 1,
          readerId: 1,
          staffId: 1,
          updatedAt: 1,
          // Tạo field hiển thị tên chung
          fullName: {
            $cond: {
              if: { $eq: ["$role", "user"] },
              then: { $concat: ["$readerInfo.hoLot", " ", "$readerInfo.ten"] },
              else: { $concat: ["$staffInfo.hoLot", " ", "$staffInfo.ten"] }
            }
          }
        },
      },
      { $sort: { role: 1, username: 1 } }
    ];

    return await this.User.aggregate(pipeline).toArray();
  }

  async update(id, data) {
    const update = this.extract(data);
    if (data.password) {
        update.password = await bcrypt.hash(data.password, 10);
    }
    const result = await this.User.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.User.findOneAndDelete({ _id: new ObjectId(id) });
    return result;
  }
  
  // ensureDefaultAdmin giữ nguyên...
  async ensureDefaultAdmin() {
    const count = await this.User.countDocuments({ role: "admin" });
    if (count > 0) return;
    const username = process.env.ADMIN_USERNAME || "admin";
    const password = process.env.ADMIN_PASSWORD || "admin123";
    const hashed = await bcrypt.hash(password, 10);
    await this.User.insertOne({ username, password: hashed, role: "admin", createdAt: new Date(), updatedAt: new Date() });
    console.log(`[INIT] Default admin created: ${username}`);
  }
}

module.exports = UserService;