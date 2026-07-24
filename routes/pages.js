const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const planController = require('../controllers/planController');

router.get('/', pageController.home);
router.get('/about', pageController.about);
router.get('/plans', pageController.plans);
router.get('/plans/:id', planController.show);
router.get('/how-it-works', pageController.howItWorks);
router.get('/menu', pageController.menu);
router.get('/why-choose-us', pageController.whyChooseUs);
router.get('/testimonials', pageController.testimonials);
router.get('/faq', pageController.faq);
router.get('/contact', pageController.contact);

module.exports = router;
