const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  register,
  login,
  me,
  updateTheme,
} = require("../controllers/authController");

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, me);
router.put(
  "/theme",
  authMiddleware,
  updateTheme
);

module.exports = router;
