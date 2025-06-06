const { sendErrorResponse } = require("../helpers/send_error_response");
const District = require("../models/district.model");
const Region = require("../models/region.model");

const create = async (req, res) => {
  try {
    const { name, regionId } = req.body;
    const newDistrict = await District.create({ name, regionId });
    res.status(201).send({
      message: "Yangi ma'lumot qo'shildi",
      newDistrict,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getAll = async (req, res) => {
  try {
    const data = await District.findAll({
      include: [
        {
          model: Region,
          attributes: ["name"],
        },
      ],
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
    const data = await District.findOne({ where: { id } });

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
    const [rowsUpdated, [patchValue]] = await District.update(data, {
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
    const data = await District.destroy({ where: { id } });

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
