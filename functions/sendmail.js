// functions/index.js
const functions = require("firebase-functions");
const sendgrid = require("@sendgrid/mail");
sendgrid.setApiKey(functions.config().sendgrid.key);

exports.sendMail = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { to, from, subject, text, html } = req.body;

  try {
    await sendgrid.send({ to, from, subject, text, html });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});
