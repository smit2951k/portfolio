const express = require('express');
const router = express.Router();
const { sendCallTranscript } = require('../controllers/vapiController');

router.post('/transcript', sendCallTranscript);

module.exports = router;
