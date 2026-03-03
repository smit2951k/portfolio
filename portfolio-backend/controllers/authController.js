const jwt = require('jsonwebtoken');

exports.login = (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Verify credentials against standard hardcoded admin vars (no db check needed)
        if (
            username === process.env.ADMIN_USERNAME &&
            password === process.env.ADMIN_PASSWORD
        ) {
            // Create token payload
            const token = jwt.sign(
                { id: 'admin', role: 'admin' },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );

            res.status(200).json({
                success: true,
                token
            });
        } else {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
    } catch (error) {
        next(error);
    }
};
