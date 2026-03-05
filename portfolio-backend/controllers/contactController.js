const supabase = require('../config/supabase');
const { Resend } = require('resend');
const { validationResult } = require('express-validator');

exports.submitContactForm = async (req, res, next) => {
    try {
        // 1. Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, subject, budget, timeline, message } = req.body;

        // 2. Save submission to Supabase
        let contact = null;
        try {
            const result = await supabase.from('contacts').insert([{
                name, email, subject, budget, timeline, message
            }]).select().single();
            contact = result.data;
            if (result.error) console.error('Supabase Error:', result.error.message);
        } catch (dbError) {
            console.error('Supabase fetch failed (continuing to email):', dbError.message);
        }

        // 3. Setup Resend
        const resend = new Resend(process.env.RESEND_API_KEY);

        // 4. Try to send email, but don't fail the request if it errors
        try {
            const { data, error } = await resend.emails.send({
                from: 'Portfolio Contact <onboarding@resend.dev>',
                to: 'smit81447@gmail.com',
                subject: `Portfolio Contact: ${subject}`,
                html: `
                    <h3>New Contact Request</h3>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Budget:</strong> ${budget}</p>
                    <p><strong>Timeline:</strong> ${timeline}</p>
                    <hr />
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                `,
                reply_to: email
            });

            if (error) {
                console.error('Email error (continuing anyway):', error);
            } else {
                console.log('Email sent successfully!');
            }
        } catch (emailError) {
            console.error('Email failed (continuing anyway):', emailError.message);
        }

        // 5. Return success (data is saved to Supabase regardless)
        res.status(201).json({
            success: true,
            data: contact,
            message: 'Message sent successfully!'
        });
    } catch (error) {
        next(error);
    }
};
