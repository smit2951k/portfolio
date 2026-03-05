const { Resend } = require('resend');

const sendCallTranscript = async (req, res) => {
    const { transcript } = req.body;

    if (!transcript) {
        return res.status(400).json({ error: 'Transcript is required' });
    }

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: 'AI Voice Assistant <onboarding@resend.dev>',
            to: 'smit81447@gmail.com',
            subject: 'New AI Voice Assistant Call Transcript',
            text: `A user just finished a call with your AI Voice Assistant.\n\nCONVERSATION TRANSCRIPT:\n--------------------------\n${transcript}\n--------------------------`,
        });

        if (error) {
            console.error('Email error:', error);
            return res.status(500).json({ error: 'Failed to send transcript email' });
        }

        console.log('Call transcript emailed successfully');
        res.status(200).json({ message: 'Transcript sent to email' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ error: 'Failed to send transcript email' });
    }
};

module.exports = { sendCallTranscript };
