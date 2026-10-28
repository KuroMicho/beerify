require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const errorHandler = require("./middlewares/errorHandler");
const beerRoutes = require("./routes/beerRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// --- MIDDLEWARES GLOBALES ---
app.use(helmet()); // Seguridad HTTP
app.use(cors()); // Habilitar peticiones de otros dominios
app.use(express.json({ limit: "10kb" })); // Parsear JSON limitando el tamaño del body
app.use(compression()); // Comprimir respuestas (GZIP)

// Rate Limiting: Previene ataques de fuerza bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 peticiones por IP
  message: "Demasiadas peticiones desde esta IP, intente en 15 minutos.",
});
app.use("/api", limiter);

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev")); // Logger de peticiones HTTP en consola
}

// --- RUTAS ---
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/beers", beerRoutes);

// Manejador de rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ error: `Ruta ${req.originalUrl} no encontrada` });
});

// Middleware centralizado de errores (Debe ir al final)
app.use(errorHandler);

module.exports = app;
