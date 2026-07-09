const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

router.get('/locations', locationController.index);
router.get('/locations/:slug', locationController.show);

module.exports = router;
