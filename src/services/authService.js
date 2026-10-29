const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const authService = {
  register: async (userData) => {
    const newUser = await User.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
    });

    const token = generateToken(newUser._id);
    newUser.password = undefined; // Ocultar del output

    return { user: newUser, token };
  },

  login: async (email, password) => {
    if (!email || !password) {
      throw new Error("Por favor provea correo y contraseña");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new Error("No autorizado"); // Dispara 401 en errorHandler
    }

    const token = generateToken(user._id);
    return { user, token };
  },
};

module.exports = authService;
