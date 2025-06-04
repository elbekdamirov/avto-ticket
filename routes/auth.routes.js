const {
  register,
  login,
  logout,
  refreshToken,
} = require("../controllers/auth.controller");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);

module.exports = router;
