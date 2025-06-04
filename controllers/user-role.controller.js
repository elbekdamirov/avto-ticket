const { sendErrorResponse } = require("../helpers/send_error_response");
const Role = require("../models/role.model");
const UserRole = require("../models/user-role.model");
const User = require("../models/user.model");

const create = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    const role = await Role.findOne({ roleId });
    if (!role) {
      return sendErrorResponse({ message: "Bunday role mavjud" }, res, 400);
    }

    const user = await User.findByPk(userId, {
      include: {
        model: Role,
        attributes: ["id"],
      },
    });

    console.log(user);

    const rolee = user.roles.some((r) => r.id === roleId);
    if (rolee) {
      return sendErrorResponse(
        { message: "Bu role foydalanuvchida allaqachon mavjud" },
        res,
        400
      );
    }

    if (!user) {
      return sendErrorResponse({ message: "Bunday user mavjud" }, res, 400);
    }

    const newUserRole = await UserRole.create({
      userId,
      roleId,
    });

    res.status(201).json({
      message: "UserRole created successfully",
      role: newUserRole,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getAll = async (req, res) => {
  try {
    const user_roles = await UserRole.findAll({
      include: [
        {
          model: User,
          attributes: ["full_name"],
        },
        {
          model: Role,
          attributes: ["name"],
        },
      ],
    });
    res.status(200).send(user_roles);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const remove = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    const role = await Role.findOne({ where: { id: roleId } });
    if (!role) {
      return sendErrorResponse(
        { message: "Bunday role mavjud emas" },
        res,
        400
      );
    }

    const user = await User.findByPk(userId, {
      include: {
        model: Role,
        attributes: ["id"],
        through: { attributes: [] },
      },
    });

    if (!user) {
      return sendErrorResponse(
        { message: "Bunday user mavjud emas" },
        res,
        400
      );
    }

    const hasRole = user.roles.some((r) => r.id === roleId);
    if (!hasRole) {
      return sendErrorResponse(
        { message: "Bu role foydalanuvchiga biriktirilmagan" },
        res,
        400
      );
    }

    await UserRole.destroy({
      where: {
        userId,
        roleId,
      },
    });

    res.status(200).send({
      message: "User dan role olib tashlandi",
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  create,
  getAll,
  remove,
};
