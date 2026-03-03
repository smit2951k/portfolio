require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Route files
const contactRoutes = require('./routes/contact');
const projectRoutes = require('./routes/projects');
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const vapiRoutes = require('./routes/vapi');


const app = express();

// Middleware
// Helmet helps secure Express apps by setting various HTTP headers
app.use(helmet());
app.use(cors({
    origin: '*' // Allow all origins for easy testing with local html file
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Visitor Analytics Middleware
// We mount this globally but the controller will skip tracking API calls
const { trackVisit } = require('./controllers/analyticsController');
app.use(trackVisit);

// Rate limiting specifically for the contact form
const contactLimiter = rateLimit({
    windowMs: 1000, // 1 second window
    max: 500, // Effectively disabling rate limit for testing
    message: { success: false, error: 'Too many requests from this IP, please try again after an hour' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactLimiter, contactRoutes); // Apply limiter here
app.use('/api/analytics', analyticsRoutes);
app.use('/api/vapi', vapiRoutes);


// Centralised error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Server Error'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
