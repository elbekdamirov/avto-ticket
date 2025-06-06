const { sendErrorResponse } = require("../helpers/send_error_response");
const Driver = require("../models/driver.model");

const create = async (req, res) => {
  try {
    const { id, name, phone_number } = req.body;

    const driver = await Driver.findOne({
      where: { phone_number: phone_number.toLowerCase() },
    });
    if (driver) {
      return sendErrorResponse(
        { message: "Bunday avtoDriver mavjud" },
        res,
        400
      );
    }

    const newRole = await Driver.create({
      id,
      name,
      phone_number,
    });
    res.status(201).send({
      message: "Yangi ma'lumot qo'shildi",
      newRole,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getAll = async (req, res) => {
  let { limit, offset } = req.query;

  limit = limit ? parseInt(limit) : 10;
  offset = offset ? parseInt(offset) : 1;

  try {
    const data = await Driver.findAll({});
    res.status(200).send(data);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Driver.findOne({ where: { id } });

    if (!data) {
      return res.status(404).send({ message: "Data not found" });
    }

    res.status(200).send(data);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const [rowsUpdated, [patchValue]] = await Driver.update(data, {
      where: { id },
      returning: true,
    });

    if (rowsUpdated == 0) {
      res.status(400).send({ msg: "Data not found" });
    }

    res.status(200).send({ Updated: patchValue });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Driver.destroy({ where: { id } });

    if (data == 0) {
      return res.status(404).send({ message: "Data not found" });
    }

    res.status(200).send({ message: "Deleted successfully" });
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
