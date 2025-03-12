import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmailInvitation = async (email, name, eventId) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'You are invited to an event!',
        text: `Hello ${name},\n\nYou have been invited to an event. Click the link below to view details:\n\nhttp://localhost:8080/events/${eventId}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Invitation sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
