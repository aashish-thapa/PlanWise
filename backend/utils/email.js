import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmailInvitation = async (email, name, eventId) => {
    const transporter = nodemailer.createTransport({
        host: 'live.smtp.mailtrap.io',
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: 'aashishthapa520@gmail.com',
        to: email,
        subject: 'You are invited to an event!',
        text: `Hello ${name},\n\nYou have been invited to an event. Click the link below to view details:\n\nhttps://wiseplan.vercel.app/events/${eventId}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Invitation sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
