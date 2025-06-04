const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    hashed_password: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING(15),
      validate: {
        is: /^\d{2}-\d{3}-\d{2}-\d{2}$/,
      },
    },
    passport_series: {
      type: DataTypes.CHAR(2),
    },
    passport_number: {
      type: DataTypes.STRING(15),
    },
    birth_date: {
      type: DataTypes.DATEONLY,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hashed_token: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = User;
