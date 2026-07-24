const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/adminAuth');
const { doubleCsrfProtection } = require('../middleware/csrf');

// Slows down password-guessing against the admin login specifically.
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });

router.get('/admin/login', adminController.showLogin);
router.post('/admin/login', loginLimiter, adminController.submitLogin);
router.post('/admin/logout', requireAdmin, adminController.logout);

router.get('/admin', requireAdmin, adminController.showBookings);
router.post('/admin/bookings/:id/status', requireAdmin, doubleCsrfProtection, adminController.updateBookingStatus);

router.get('/admin/cafeterias', requireAdmin, adminController.showCafeterias);
router.post('/admin/cafeterias', requireAdmin, doubleCsrfProtection, adminController.createCafeteria);
router.post('/admin/cafeterias/:id', requireAdmin, doubleCsrfProtection, adminController.updateCafeteria);
router.post('/admin/cafeterias/:id/delete', requireAdmin, doubleCsrfProtection, adminController.deleteCafeteria);

router.get('/admin/menu', requireAdmin, adminController.showMenu);
router.post('/admin/menu', requireAdmin, doubleCsrfProtection, adminController.createMenuItem);
router.post('/admin/menu/:id', requireAdmin, doubleCsrfProtection, adminController.updateMenuItem);
router.post('/admin/menu/:id/delete', requireAdmin, doubleCsrfProtection, adminController.deleteMenuItem);

module.exports = router;
