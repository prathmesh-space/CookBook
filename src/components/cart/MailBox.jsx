const sendMail = async () => {
  const userEmail = user?.email || null;
  const emailData = {
    to: userEmail,
    from: "prathmeshkumbhar154@gmail.com", // must be a verified sender in SendGrid
    subject: "Your Shopping List from Cookbook-Pro",
    text: formattedEmailBody,
  };

  try {
    const response = await fetch("/api/sendMail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailData),
    });

    const result = await response.json();
    console.log("Email result:", result);
    emailSent.current = true;
  } catch (err) {
    console.error("Error sending email:", err);
  }
};
