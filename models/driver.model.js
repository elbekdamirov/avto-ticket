const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Driver = sequelize.define(
  "driver",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    phone_number: {
      type: DataTypes.STRING(15),
      validate: {
        is: /^\d{2}-\d{3}-\d{2}-\d{2}$/,
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Driver;
