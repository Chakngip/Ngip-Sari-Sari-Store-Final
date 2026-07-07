const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  register,
  login,
  me,
  updateTheme,

} = require("../controllers/authController");
console.log("register:", typeof register);
console.log("login:", typeof login);
console.log("me:", typeof me);
console.log("updateTheme:", typeof updateTheme);

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, me);
router.put("/theme",authMiddleware,updateTheme);

module.exports = router;
