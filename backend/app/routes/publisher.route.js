const express = require("express");
const { auth } = require("../middleware/auth");
const ctrl = require("../controllers/publisher.controller");

const router = express.Router();

router.route("/")
  .get(auth(["admin","staff", "user"]), ctrl.findAll) // User cũng cần lấy list NXB để xem info nếu cần
  .post(auth(["admin", "staff"]), ctrl.create);

router.route("/:id")
  .put(auth(["admin", "staff"]), ctrl.update)
  .delete(auth(["admin", "staff"]), ctrl.delete);

module.exports = router;