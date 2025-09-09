import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, from, subject, text, html } = req.body;

  if (!to || !from || !subject || !text) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const msg = {
    to,
    from,
    subject,
    text,
    html,
  };

  try {
    await sendgrid.send(msg);
    console.log("✅ Email sent:", msg);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ SendGrid error:", error);
    res.status(error.code || 500).json({
      success: false,
      error: error.message,
    });
  }
}
