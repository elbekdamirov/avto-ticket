const { sendErrorResponse } = require("../helpers/send_error_response");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const { jwtService } = require("../services/jwt.service");
const config = require("config");
const Role = require("../models/role.model");

const register = async (req, res) => {
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

    const payload = {
      id: newData.id,
      email: newData.email,
    };
    const tokens = jwtService.generateTokens(payload);

    const hashed_token = await bcrypt.hash(tokens.accessToken, 7);

    newData.hashed_token = hashed_token;
    await newData.save();

    res.cookie("refresh_token", tokens.refreshToken, {
      maxAge: config.get("cookie_refresh_time"),
      httpOnly: true,
    });

    res.status(201).send({
      message: "User registered",
      newData,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        { model: Role, attributes: ["name"], through: { attributes: [] } },
      ],
    });
    if (!user) {
      return sendErrorResponse(
        { message: "Email or Password Incorrect" },
        res,
        400
      );
    }
    const verifyPassword = await bcrypt.compare(password, user.hashed_password);
    if (!verifyPassword) {
      return sendErrorResponse(
        { message: "Email or Password Incorrect" },
        res,
        400
      );
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.roles,
    };
    const tokens = jwtService.generateTokens(payload);

    const hashed_token = await bcrypt.hash(tokens.accessToken, 7);

    user.hashed_token = hashed_token;
    await user.save();

    res.cookie("refresh_token", tokens.refreshToken, {
      maxAge: config.get("cookie_refresh_time"),
      httpOnly: true,
    });

    res
      .status(200)
      .send({ message: "User logged in", accessToken: tokens.accessToken });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const logout = async (req, res) => {
  try {
    const { refresh_token } = req.cookies;

    if (!refresh_token) {
      return sendErrorResponse(
        { message: "Cookieda refreshToken topilmadi" },
        res,
        400
      );
    }

    const decodedToken = await jwtService.verifyRefreshToken(refresh_token);

    const user = await User.update(
      { hashed_token: null },
      { where: { id: decodedToken.id }, returning: true }
    );

    if (!user) {
      return res.status(400).send({ message: "Token noto'g'ri" });
    }

    res.clearCookie("refresh_token");
    res.send({ message: "User logged out" });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.cookies;

    if (!refresh_token) {
      return res
        .status(400)
        .send({ message: "Cookieda refresh token topilmadi" });
    }

    const decodedToken = await jwtService.verifyRefreshToken(refresh_token);

    const user = await User.findByPk(decodedToken.id, {
      // include: [
      //   { model: Role, attributes: ["name"], through: { attributes: [] } },
      // ],
    });

    if (!user) {
      return res.status(401).send({ message: "Bunday user token topilmadi" });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.roles,
    };
    const tokens = jwtService.generateTokens(payload);

    const hashed_token = await bcrypt.hash(tokens.accessToken, 7);

    user.hashed_token = hashed_token;
    await user.save();

    res.cookie("refresh_token", tokens.refreshToken, {
      maxAge: config.get("cookie_refresh_time"),
      httpOnly: true,
    });

    res.status(200).send({
      message: "Tokenlar yangilandi",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
};
