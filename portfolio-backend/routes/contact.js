const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { submitContactForm } = require('../controllers/contactController');

router.post(
    '/',
    [
        // Input sanitisation and validation
        body('name').trim().escape().notEmpty().withMessage('Name is required'),
        body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
        body('subject').trim().escape().notEmpty().withMessage('Subject is required'),
        body('message').trim().escape().notEmpty().withMessage('Message is required'),
        body('budget').trim().escape().optional(),
        body('timeline').trim().escape().optional()
    ],
    submitContactForm
);

module.exports = router;
