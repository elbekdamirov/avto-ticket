const {
  create,
  getAll,
  remove,
  update,
} = require("../controllers/user-role.controller");

const router = require("express").Router();

router.post("/", create);
router.get("/", getAll);
router.post("/remove", remove);
router.patch("/:id", update);

module.exports = router;
