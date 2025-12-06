const MongoDB = require("../utils/mongodb.util");
const PublisherService = require("../services/publisher.service");

const svc = () => new PublisherService(MongoDB.getClient());

exports.findAll = async (req, res, next) => {
  try { res.json(await svc().findAll()); } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try { res.status(201).json(await svc().create(req.body)); } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await svc().update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Publisher not found" });
    res.json(updated);
  } catch (e) { next(e); }
};

exports.delete = async (req, res, next) => {
  try {
    await svc().delete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (e) { next(e); }
};