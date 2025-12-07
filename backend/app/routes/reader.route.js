// app/routes/reader.route.js
const express = require("express");
const ctrl = require("../controllers/reader.controller");
const router = express.Router();
const {auth} = require("../middleware/auth");

router.post("/", ctrl.create);
router.get("/", auth(["admin","staff" , "user"]), ctrl.findAll);

// [THÊM MỚI] Routes cho Favorites
router.get("/favorites", auth(["user"]), ctrl.getFavorites);
router.post("/favorites/:bookId", auth(["user"]), ctrl.addFavorite);
router.delete("/favorites/:bookId", auth(["user"]), ctrl.removeFavorite);

module.exports = router;
