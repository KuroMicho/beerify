const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// OPCIÓN 1: Cloudinary (Recomendado para Producción)
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => {
      if (req.originalUrl.includes("beers")) {
        return "beerify/beers";
      }
      return "beerify/profiles";
    },
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

// OPCIÓN 2: Almacenamiento Local (Alternativa Multer normal)
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

// Usamos Cloudinary por defecto para este entorno
const upload = multer({ storage: cloudinaryStorage });
module.exports = upload;
