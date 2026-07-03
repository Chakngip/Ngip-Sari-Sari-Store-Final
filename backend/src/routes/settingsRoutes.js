const router = require('express').Router();
const { getPublicSettings } = require('../controllers/settingsController');

router.get('/', getPublicSettings);

module.exports = router;
