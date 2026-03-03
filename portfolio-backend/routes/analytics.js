const express = require('express');
const router = express.Router();
const { getAnalytics, trackVisitApi } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

// Protected admin endpoint to fetch analytics data
router.get('/', protect, getAnalytics);

// Public endpoint to track visit
router.post('/track', trackVisitApi);

module.exports = router;
