const { where } = require("sequelize");
const { sendErrorResponse } = require("../helpers/send_error_response");
const Role = require("../models/role.model");
const User = require("../models/user.model");

const create = async (req, res) => {
  try {
    const { name } = req.body;

    const candidate = await Role.findOne({
      where: { name: name.toLowerCase() },
    });
    if (candidate) {
      return sendErrorResponse({ message: "Bunday role mavjud" }, res, 400);
    }

    const newData = await Role.create({
      name: name.toLowerCase(),
    });
    res.status(201).send({ message: "New Role Added", newData });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getAll = async (req, res) => {
  try {
    const data = await Role.findAll({
    //   include: [
    //     {
    //       model: User,
    //       attributes: ["full_name", "email"],
    //     },
    //   ],
      attributes: ["id", "name"],
    });
    res.status(200).send(data);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Role.findByPk(id);
    res.status(201).send(data);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const user = await Role.update({
      where: { id },
      data: updateData,
    });

    res.status(200).send({
      message: "Updated successfully",
      data: user,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Role.findByPk(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    await user.destroy();
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove,
};
