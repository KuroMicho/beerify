const express = require("express");
const beerController = require("../controllers/beerController");
const { restrictTo, protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Definición de endpoints CRUD
router.use(protect);

router
  .route("/")
  .get(beerController.getAll)
  .post(restrictTo("admin"), upload.single("image"), beerController.create);

router
  .route("/:id")
  .get(beerController.getById)
  .put(restrictTo("admin"), upload.single("image"), beerController.update)
  .delete(restrictTo("admin"), beerController.remove);

module.exports = router;
