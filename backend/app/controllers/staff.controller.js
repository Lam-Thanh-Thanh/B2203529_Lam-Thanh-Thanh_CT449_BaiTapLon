const MongoDB = require("../utils/mongodb.util");
const StaffService = require("../services/staff.service");

const svc = () => new StaffService(MongoDB.getClient());

exports.findAll = async (req, res, next) => {
  try {
    const data = await svc().findAll();
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const created = await svc().create(req.body);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const data = await svc().findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Staff not found" });
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await svc().update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Staff not found" });
    res.json(updated);
  } catch (e) {
    next(e);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await svc().delete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (e) {
    next(e);
  }
};
