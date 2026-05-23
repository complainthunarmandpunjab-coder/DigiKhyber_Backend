const express = require('express');
const { adminGenerateAndSendPDF, getAllUsers, getUserById } = require('../controllers/userController');
const adminApiKeyMiddleware = require('../middleware/adminApiKeyMiddleware');

const router = express.Router();

// Apply admin API key middleware to all admin routes
router.use(adminApiKeyMiddleware);

// Admin PDF generation route
router.post('/generate-pdf', adminGenerateAndSendPDF);

// Get all students/users for admin dashboard
router.get('/users', getAllUsers);

// Get single user by ID
router.get('/users/:id', getUserById);

module.exports = router;
