// /api/sendMail.js
import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY); // Set in Vercel env vars

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { to, from, subject, text, html } = req.body;

    const msg = {
      to,
      from,
      subject,
      text,
      html,
    };

    await sendgrid.send(msg);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("SendGrid error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
