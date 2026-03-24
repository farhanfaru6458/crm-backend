/**
 * Sends transactional email via Brevo REST API (HTTPS).
 * Works on Render since it uses HTTPS, not SMTP.
 */
export const sendEmail = async (to, subject, text) => {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const EMAIL_USER = process.env.EMAIL_USER;

  console.log(`[sendEmail] Sending to: ${to} | BREVO_KEY_SET: ${!!BREVO_API_KEY}`);

  if (!BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY environment variable is not set.");
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: "CRM App",
        email: EMAIL_USER || "crmc6551@gmail.com",
      },
      to: [{ email: to }],
      subject,
      textContent: text,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    console.error("[sendEmail] Brevo API Error:", errorBody);
    throw new Error(`Brevo API error: ${response.status} - ${JSON.stringify(errorBody)}`);
  }

  console.log(`[sendEmail] Email sent via Brevo to ${to} ✅`);
};

/**
 * Fire-and-forget wrapper — sends email in background.
 * Caller gets instant response; errors are only logged.
 */
export const sendEmailAsync = (to, subject, text) => {
  sendEmail(to, subject, text).catch((err) => {
    console.error(`[sendEmailAsync] Failed to send email to ${to}: ${err.message}`);
  });
};