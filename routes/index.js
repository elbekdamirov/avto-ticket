const router = require("express").Router();
const authRouter = require("./auth.routes");
const roleRouter = require("./role.routes");
const userRoleRouter = require("./user-role.routes");
const usersRouter = require("./user.routes");
const busRoutes = require("../routes/bus.routes");
const driverRoutes = require("../routes/driver.routes");
const busDriverRoutes = require("../routes/busDriver.routes");
const reigonRoutes = require("../routes/region.routes");
const districtRoutes = require("../routes/district.routes");

router.use("/auth", authRouter);
router.use("/role", roleRouter);
router.use("/user-role", userRoleRouter);
router.use("/users", usersRouter);
router.use("/bus", busRoutes);
router.use("/driver", driverRoutes);
router.use("/bus-driver", busDriverRoutes);
router.use("/region", reigonRoutes);
router.use("/district", districtRoutes);

module.exports = router;
