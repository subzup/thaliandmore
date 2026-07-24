const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const leadController = require('../controllers/leadController');

// Basic abuse protection on public lead-capture endpoints
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  '/trial',
  formLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('phone')
      .trim()
      .matches(/^[6-9]\d{9}$/)
      .withMessage('Enter a valid 10-digit Indian mobile number'),
    body('locality').trim().notEmpty().withMessage('Please select your locality'),
  ],
  leadController.trialSignup
);

router.post(
  '/contact',
  formLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('phone')
      .trim()
      .matches(/^[6-9]\d{9}$/)
      .withMessage('Enter a valid 10-digit Indian mobile number'),
    body('email').trim().isEmail().withMessage('Enter a valid email address').normalizeEmail(),
    body('location').trim().notEmpty().withMessage('Please select your locality'),
    body('message').trim().notEmpty().withMessage('Message cannot be empty').isLength({ max: 1000 }),
  ],
  leadController.contactSubmit
);

router.post(
  '/corporate-catering',
  formLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('phone')
      .trim()
      .matches(/^[6-9]\d{9}$/)
      .withMessage('Enter a valid 10-digit Indian mobile number'),
    body('email').trim().isEmail().withMessage('Enter a valid email address').normalizeEmail(),
    body('requirementType').trim().notEmpty().withMessage('Please select the type of requirement'),
    body('eventDate').trim().notEmpty().withMessage('Please select an event date'),
    body('deliveryTime').trim().notEmpty().withMessage('Please select a preferred delivery time'),
    body('recurring').trim().notEmpty().withMessage('Please select a recurrence option'),
    body('numberOfMeals').trim().isInt({ min: 1 }).withMessage('Enter a valid number of meals'),
    body('mealPreference').trim().notEmpty().withMessage('Please select a meal preference'),
    body('thali').trim().notEmpty().withMessage('Please select a thali'),
    body('cafeteria').trim().notEmpty().withMessage('Please select a delivery cafeteria'),
    body('companyName')
      .if(body('cafeteria').equals('Other Location'))
      .trim()
      .notEmpty()
      .withMessage('Company name is required for other locations'),
    body('officeAddress')
      .if(body('cafeteria').equals('Other Location'))
      .trim()
      .notEmpty()
      .withMessage('Office address is required for other locations'),
    body('specialInstructions').optional({ checkFalsy: true }).trim().isLength({ max: 1000 }),
  ],
  leadController.corporateCateringSubmit
);

router.post(
  '/newsletter',
  formLimiter,
  [body('email').trim().isEmail().withMessage('Enter a valid email address').normalizeEmail()],
  leadController.newsletterSubmit
);

module.exports = router;
