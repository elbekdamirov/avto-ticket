const { Op } = require("sequelize");
const { sendErrorResponse } = require("../helpers/send_error_response");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const Role = require("../models/role.model");

const create = async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      passport_series,
      passport_number,
      birth_date,
      is_active,
      password,
      confirm_password,
    } = req.body;

    const user = await User.findOne({ where: { email } });
    if (user) {
      return sendErrorResponse({ message: "Bunday user mavjud" }, res, 400);
    }

    if (password != confirm_password) {
      return sendErrorResponse({ message: "Parollar mos emas" }, res, 400);
    }

    const hashed_password = await bcrypt.hash(password, 7);

    const newData = await User.create({
      full_name,
      email,
      phone,
      passport_series,
      passport_number,
      birth_date,
      is_active,
      hashed_password,
    });

    res.status(201).send({
      message: "User added",
      newData,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getAll = async (req, res) => {
  try {
    const data = await User.findAll({
      include: [
        {
          model: Role,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
    });
    res.status(200).send(data);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Users.findByPk(id, {
      include: [
        {
          model: UserAddress,
          attributes: ["name", "address"],
        },
        {
          model: Machine,
          attributes: ["name", "is_available"],
        },
      ],
    });
    res.status(201).send(data);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    await user.update(updateData);
    res.status(200).send({ message: "Updated successfully", data: user });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    await user.destroy();
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const selectByTime = async (req, res) => {
  const { full_name, start_time, end_time, category } = req.body;

  const data = await Users.findAll({
    where: { full_name },
    include: [
      {
        model: Contract,
        include: [
          {
            model: Machine,
            attributes: ["name"],
            include: [
              {
                model: Category,
                where: { name: category },
              },
            ],
          },
        ],
        attributes: ["start_time", "end_time"],
        where: {
          start_time: {
            [Op.between]: [start_time, end_time],
          },
          end_time: {
            [Op.between]: [start_time, end_time],
          },
        },
      },
    ],

    attributes: ["full_name"],
  });

  res.status(200).send({ data });
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove,
  selectByTime,
};
