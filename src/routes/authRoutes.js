const express = require("express");
const authController = require("../controllers/authController");
const { default: mongoose } = require("mongoose");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

router.post("/clean-database", async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ error: "Denegado en producción" });
  }

  try {
    await mongoose.connection.db.dropDatabase();

    return res.status(200).json({
      status: "success",
      message: `Base de datos '${mongoose.connection.name}' eliminada por completo.`,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
