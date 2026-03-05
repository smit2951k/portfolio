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

        // 2. Return success immediately for fast response
        res.status(201).json({
            success: true,
            data: null,
            message: 'Message sent successfully!'
        });

        // 3. Process database insert and email in background
        setImmediate(async () => {
            // Save submission to Supabase
            try {
                const result = await supabase.from('contacts').insert([{
                    name, email, subject, budget, timeline, message
                }]).select().single();
                if (result.error) console.error('Supabase Error:', result.error.message);
            } catch (dbError) {
                console.error('Supabase fetch failed:', dbError.message);
            }

            // Setup Resend
            const resend = new Resend(process.env.RESEND_API_KEY);

            // Send Email
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
                        <p><strong>Budget:</strong> ${budget || 'N/A'}</p>
                        <p><strong>Timeline:</strong> ${timeline || 'N/A'}</p>
                        <hr />
                        <p><strong>Message:</strong></p>
                        <p>${message}</p>
                    `,
                    reply_to: email
                });

                if (error) {
                    console.error('Email error:', error);
                } else {
                    console.log('Email sent successfully!');
                }
            } catch (emailError) {
                console.error('Email failed:', emailError.message);
            }
        });

    } catch (error) {
        // If there's a synchronous error before we respond
        if (!res.headersSent) {
            next(error);
        } else {
            console.error('Background error:', error);
        }
    }
};
