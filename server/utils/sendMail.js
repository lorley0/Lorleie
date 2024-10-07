const nodemailer = require('nodemailer');
const mailgen = require('mailgen');

// Create transporter function
const createTransport = () => {
    const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD } = process.env;

    if (!MAIL_HOST || !MAIL_PORT || !MAIL_USER || !MAIL_PASSWORD) {
        throw new Error('Email configuration environment variables are missing');
    }

    return nodemailer.createTransport({
        host: MAIL_HOST,
        port: Number(MAIL_PORT), // Convert to number
        secure: MAIL_PORT === '465', // Use true if port is 465
        auth: {
            user: MAIL_USER,
            pass: MAIL_PASSWORD
        },
    });
};

// Generate Email Content
const generateEmailContent = (name, otp) => {
    return {
        body: {
            name,
            intro: "Welcome to Lorley! We're very excited to have you on board.",
            outro: `Your OTP for verification is ${otp}. It will expire in 10 minutes.`
        }
    };
};

// Create HTML Email Body
const generateHtmlEmailContent = (emailContent) => {
    const mailGenerator = new mailgen({
        theme: 'default',
        product: {
            name: 'Lorley',
            link: 'https://localhost:3000', // Update with your actual app link
        }
    });
    return mailGenerator.generate(emailContent);
};

// Main function to send email
const sendMail = async (recipientEmail, otp) => {
    try {
        console.log('Sending email to:', recipientEmail); // Debug log

        if (!recipientEmail) {
            throw new Error('No recipient email provided');
        }

        // Generate HTML email content
        const emailContent = generateEmailContent(recipientEmail, otp);
        const emailBody = generateHtmlEmailContent(emailContent);

        const transport = createTransport();

        const message = {
            from: process.env.MAIL_USER,
            to: recipientEmail,
            subject: 'OTP for Verification',
            html: emailBody,
        };

        // Send email
        await transport.sendMail(message);

        return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(error.message || 'Error sending OTP email');
    }
};

module.exports = sendMail;
