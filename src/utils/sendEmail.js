import nodemailer from "nodemailer";

/**
 * Attempts to send an email via Gmail SMTP.
 * Throws if it fails.
 */
export const sendEmail = async (to, subject, text) => {
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;

  console.log(`[sendEmail] Sending to: ${to} | USER_SET: ${!!EMAIL_USER} | PASS_SET: ${!!EMAIL_PASS}`);

  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error("EMAIL_USER or EMAIL_PASS environment variable is not set.");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    connectionTimeout: 8000,   // 8s — fail fast on Render SMTP block
    greetingTimeout: 8000,
    socketTimeout: 10000,
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: `"CRM App" <${EMAIL_USER}>`,
    to,
    subject,
    text,
  });

  console.log(`[sendEmail] Sent! MessageId: ${info.messageId}`);
};

/**
 * Fire-and-forget wrapper — sends email in background.
 * The caller gets an instant response; email errors only appear in logs.
 */
export const sendEmailAsync = (to, subject, text) => {
  sendEmail(to, subject, text).catch((err) => {
    console.error(`[sendEmailAsync] Failed to send email to ${to}: ${err.message}`);
  });
};