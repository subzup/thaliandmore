const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const orderController = require('../controllers/orderController');
const { doubleCsrfProtection } = require('../middleware/csrf');

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/corporate-order', orderController.showOrderPage);

router.post(
  '/api/corporate-order',
  orderLimiter,
  doubleCsrfProtection,
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('phone')
      .trim()
      .matches(/^[6-9]\d{9}$/)
      .withMessage('Enter a valid 10-digit Indian mobile number'),
    body('requiredTime')
      .trim()
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage('Please select what time you need the food'),
    body('cafeteriaId').notEmpty().withMessage('Please select a cafeteria').isInt(),
    body('items').isArray({ min: 1 }).withMessage('Please add at least one item to your order'),
    body('specialInstructions').optional({ checkFalsy: true }).trim().isLength({ max: 1000 }),
    body('idempotencyKey').trim().notEmpty().isLength({ max: 100 }),
  ],
  orderController.submitOrder
);

module.exports = router;
