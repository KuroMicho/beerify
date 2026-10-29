const userService = require("../services/userService");
const catchAsync = require("../utils/catchAsync");

const userController = {
  getAll: catchAsync(async (req, res) => {
    const users = await userService.getAllUsers();
    res.status(200).json({ status: "success", data: users });
  }),

  getById: catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({ status: "success", data: user });
  }),

  update: catchAsync(async (req, res) => {
    if (req.body.password)
      throw new Error("Ruta inválida para actualizar contraseñas");
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({ status: "success", data: updatedUser });
  }),

  remove: catchAsync(async (req, res) => {
    await userService.deleteUser(req.params.id);
    res.status(204).json({ status: "success", data: null });
  }),

  uploadProfilePicture: catchAsync(async (req, res) => {
    if (!req.file) throw new Error("Debe subir una imagen");
    const imageUrl = req.file.path;
    const updatedUser = await userService.updateUser(req.user.id, {
      profilePicture: imageUrl,
    });
    res.status(200).json({ status: "success", data: updatedUser });
  }),
};

module.exports = userController;
