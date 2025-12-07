// app/controllers/reader.controller.js
const MongoDB = require("../utils/mongodb.util");
const ReaderService = require("../services/reader.service");
const svc = () => new ReaderService(MongoDB.getClient());

exports.create = async (req, res, next) => {
  try { res.status(201).json(await svc().create(req.body)); } catch (e) { next(e); }
};
exports.findAll = async (req, res, next) => {
  try { res.json(await svc().findAll()); } catch (e) { next(e); }
};
exports.addFavorite = async (req, res, next) => {
  try {
    // Lấy readerId từ token (req.user)
    await svc().addFavorite(req.user.readerId, req.params.bookId);
    res.json({ message: "Added to favorites" });
  } catch (e) { next(e); }
};

exports.removeFavorite = async (req, res, next) => {
  try {
    await svc().removeFavorite(req.user.readerId, req.params.bookId);
    res.json({ message: "Removed from favorites" });
  } catch (e) { next(e); }
};

exports.getFavorites = async (req, res, next) => {
  try {
    const list = await svc().getFavorites(req.user.readerId);
    res.json(list);
  } catch (e) { next(e); }
};