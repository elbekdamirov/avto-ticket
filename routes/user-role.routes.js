const {
  create,
  getAll,
  remove,
} = require("../controllers/user-role.controller");

const router = require("express").Router();

router.post("/", create);
router.get("/", getAll);
router.post("/remove", remove);

module.exports = router;
