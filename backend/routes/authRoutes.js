const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, checkAuth } = require('../middleware/authMiddleware');

router.post('/verify-password', protect, authController.verifyPassword); 
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.get('/check', checkAuth);
// Add this new route

module.exports = router;