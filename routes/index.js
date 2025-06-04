const router = require("express").Router();
const authRouter = require("./auth.routes");
const roleRouter = require("./role.routes");
const userRoleRouter = require("./user-role.routes");
const usersRouter = require("./user.routes");

router.use("/auth", authRouter);
router.use("/role", roleRouter);
router.use("/user-role", userRoleRouter);
router.use("/users", usersRouter);

module.exports = router;
