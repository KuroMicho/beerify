const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(err.name, err.message);

  // Errores operacionales controlados (Ej: ID no existe)
  if (err.message === "Recurso no encontrado") {
    return res.status(404).json({ status: "error", message: err.message });
  }

  // Errores de JWT (Autenticación)
  if (
    err.name === "JsonWebTokenError" ||
    err.name === "TokenExpiredError" ||
    err.message === "No autorizado"
  ) {
    return res.status(401).json({
      status: "fail",
      message: "Token inválido o expirado. Inicia sesión.",
    });
  }

  // Error de validación de Mongoose (Datos incorrectos o faltantes)
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res
      .status(400)
      .json({ status: "fail", message: "Datos inválidos", details: messages });
  }

  // Error de casteo (Ej: ID con formato incorrecto)
  if (err.name === "CastError") {
    return res
      .status(400)
      .json({ status: "fail", message: `ID inválido: ${err.value}` });
  }

  // Errores inesperados del servidor
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "error",
    message:
      process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
        ? err.message
        : "Error interno del servidor",
  });
};

module.exports = errorHandler;
