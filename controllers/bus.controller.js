const { sendErrorResponse } = require("../helpers/send_error_response");
const Bus = require("../models/bus.model");
const Driver = require("../models/driver.model");

const create = async (req, res) => {
  try {
    const { id, number_plate, seat_count, model } = req.body;

    const bus = await Bus.findOne({
      where: { number_plate: number_plate.toLowerCase() },
    });
    if (bus) {
      return sendErrorResponse(
        { message: "This bus already exists" },
        res,
        400
      );
    }

    const newData = await Bus.create({
      id,
      number_plate,
      seat_count,
      model,
    });
    res.status(201).send({
      message: "Yangi ma'lumot qo'shildi",
      newData,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getAll = async (req, res) => {
  try {
    const data = await Bus.findAll({});
    res.status(200).send(data);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Bus.findOne({
      where: { id },
      include: [
        { model: Driver, attributes: ["name"], through: { attributes: [] } },
      ],
    });

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
    const [rowsUpdated, [patchValue]] = await Bus.update(data, {
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
    const data = await Bus.destroy({ where: { id } });

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
