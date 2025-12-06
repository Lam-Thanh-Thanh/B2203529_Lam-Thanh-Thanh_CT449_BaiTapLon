// app/routes/book.route.js
const express = require("express");
const books = require("../controllers/book.controller");
const { auth } = require("../middleware/auth");
const upload = require("../middleware/upload"); // [Thêm dòng này]

const router = express.Router();

router
  .route("/")
  .get(books.findAll)   // GET /api/books?q=keyword
  .post(auth(["admin", "staff"]), upload.single("image"), books.create)
  .delete(auth(["admin", "staff"]), books.deleteAll); // DELETE /api/books

router
  .route("/:id")
  .get(books.findOne)   // GET /api/books/:id
  .put(auth(["admin", "staff"]), upload.single("image"), books.update)
  .delete(auth(["admin", "staff"]), books.delete); // DELETE /api/books/:id

module.exports = router;
