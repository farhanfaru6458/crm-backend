import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  console.log(`[sendEmail] Attempting to send email to: ${to}`);
  console.log(`[sendEmail] EMAIL_USER set: ${!!process.env.EMAIL_USER}`);
  console.log(`[sendEmail] EMAIL_PASS set: ${!!process.env.EMAIL_PASS}`);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // use STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"CRM App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log(`[sendEmail] Email sent successfully. MessageId: ${info.messageId}`);
  } catch (err) {
    console.error(`[sendEmail] FAILED to send email to ${to}:`, err.message);
    throw err; // re-throw so caller can handle
  }
};