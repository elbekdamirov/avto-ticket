const { sendErrorResponse } = require("../helpers/send_error_response");
const District = require("../models/district.model");
const Region = require("../models/region.model");

const create = async (req, res) => {
  try {
    const { name } = req.body;
    const newRegion = await Region.create({ name });
    res.status(201).send({
      message: "Yangi ma'lumot qo'shildi",
      newRegion,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getAll = async (req, res) => {
  try {
    const data = await Region.findAll({
      include: {
        model: District,
        attributes: ["name"],
      },
      attributes: ["name"],
    });
    res.status(200).send(data);
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Region.findOne({ where: { id } });

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
    const [rowsUpdated, [patchValue]] = await Region.update(data, {
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
    const data = await Region.destroy({ where: { id } });

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
