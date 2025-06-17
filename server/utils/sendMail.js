// utils/sendMail.js
import nodemailer from 'nodemailer';
import { config } from '../config/keys.js';

const sendSupportMail = async ({ name, email, message }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.supportEmail,
      pass: config.supportEmailPass,
    },
  });

  await transporter.sendMail({
    from: config.supportEmail,
    to: config.supportEmail,
    subject: `New Query from ${name}`,
    html: `
      <h3>Sender: ${name}</h3>
      <p>Email: ${email}</p>
      <p>Message: ${message}</p>
    `,
  });
};


export async function sendMail({ to, subject, html }) {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER, // your email or app email
      pass: process.env.SMTP_PASS, // your email password or app password
    },
  });

  await transporter.sendMail({
    from: `"Daksh Team" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}
export default sendSupportMail;
