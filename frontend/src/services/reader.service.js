import createApiClient from "./api.service";
class ReaderService {
  constructor(baseUrl = "/api/readers") { this.api = createApiClient(baseUrl); }
  async create(data) { return (await this.api.post("/", data)).data; }
  async list() { return (await this.api.get("/")).data; }
  // [THÊM MỚI]
  async getFavorites() {
    return (await this.api.get("/favorites")).data;
  }
  async addFavorite(bookId) {
    return (await this.api.post(`/favorites/${bookId}`)).data;
  }
  async removeFavorite(bookId) {
    return (await this.api.delete(`/favorites/${bookId}`)).data;
  }
}
export default new ReaderService();
