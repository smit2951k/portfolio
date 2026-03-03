const nodemailer = require('nodemailer');

const sendCallTranscript = async (req, res) => {
    const { transcript } = req.body;

    if (!transcript) {
        return res.status(400).json({ error: 'Transcript is required' });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Sending to yourself
            subject: 'New AI Voice Assistant Call Transcript',
            text: `A user just finished a call with your AI Voice Assistant.\n\nCONVERSATION TRANSCRIPT:\n--------------------------\n${transcript}\n--------------------------`,
        };

        await transporter.sendMail(mailOptions);
        console.log('Call transcript emailed successfully');
        res.status(200).json({ message: 'Transcript sent to email' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ error: 'Failed to send transcript email' });
    }
};

module.exports = { sendCallTranscript };
