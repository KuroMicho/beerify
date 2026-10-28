const authService = require("../services/authService");
const catchAsync = require("../utils/catchAsync");

const authController = {
  register: catchAsync(async (req, res) => {
    const result = await authService.register(req.body);

    res.status(201).json({
      status: "success",
      data: { user: result.user },
    });
  }),

  login: catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.status(200).json({
      status: "success",
      token: result.token,
    });
  }),
};

module.exports = authController;
