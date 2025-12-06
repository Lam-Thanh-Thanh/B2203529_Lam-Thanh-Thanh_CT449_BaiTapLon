const express = require("express");
const { auth } = require("../middleware/auth");
const ctrl = require("../controllers/staff.controller");

const router = express.Router();

router.use(auth(["admin"]));

router.route("/")
  .get(ctrl.findAll)
  .post(ctrl.create);

router.route("/:id")
  .get(ctrl.findOne)
  .put(ctrl.update)
  .delete(ctrl.delete);

module.exports = router;
