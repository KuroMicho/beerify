const express = require("express");
const userController = require("../controllers/userController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.use(protect);

// Usuario subiendo su imagen
router.post(
  "/profile-picture",
  upload.single("image"),
  userController.uploadProfilePicture,
);

// CRUD de Administración
router.use(restrictTo("admin"));

router.route("/").get(userController.getAll);

router
  .route("/:id")
  .get(userController.getById)
  .put(userController.update)
  .delete(userController.remove);

module.exports = router;
