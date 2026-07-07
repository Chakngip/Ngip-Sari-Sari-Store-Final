const router = require("express").Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/usersController");

router.get(
  "/profile",
  authMiddleware,
  getProfile,
);

router.put(
  "/profile",
  authMiddleware,
  updateProfile,
);

router.put(
  "/change-password",
  authMiddleware,
  changePassword,
);

module.exports = router;