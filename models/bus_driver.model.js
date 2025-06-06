const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Buses = require("./bus.model");
const Driver = require("./driver.model");

const BusDriver = sequelize.define(
  "busDriver",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Buses.belongsToMany(Driver, { through: "busDriver" });
Driver.belongsToMany(Buses, { through: "busDriver" });

module.exports = BusDriver;
