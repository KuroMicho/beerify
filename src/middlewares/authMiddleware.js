const jwt = require("jsonwebtoken");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

// Middleware para verificar que el usuario tenga un Token válido
const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) throw new Error("No autorizado");

  // Verifica el token (Lanzará JsonWebTokenError si es inválido)
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Verifica si el usuario aún existe
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) throw new Error("No autorizado");

  req.user = currentUser;
  next();
});

// Middleware para restringir por roles (Ej: Solo administradores)
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "No tienes permiso para realizar esta acción",
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
