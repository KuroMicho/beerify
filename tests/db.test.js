const mongoose = require("mongoose");
const logger = require("../src/utils/logger");

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
  override: true,
  quiet: true,
});

describe("Prueba de Conexión a MongoDB (Variables de Entorno)", () => {
  jest.setTimeout(20000);

  beforeAll(async () => {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error(
        "MONGO_URI no está definida. Verifica que el archivo .env.test exista.",
      );
    }

    mongoose.connection.on("connecting", () =>
      logger.info("Intentando conectar a MongoDB..."),
    );
    mongoose.connection.on("connected", () =>
      logger.info(`Conexión exitosa a: ${mongoose.connection.name}`),
    );

    try {
      await mongoose.connect(uri);
    } catch (error) {
      logger.error("Mensaje:", error.message);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
        logger.info("Mongoose desconectado correctamente.");
      }
    } catch (error) {
      logger.error("Error al cerrar conexión:", error.message);
    }
  });

  test("La conexión con MongoDB debe estar activa (readyState === 1)", () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
});
