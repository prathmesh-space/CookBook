const sendMail = async () => {
  const userEmail = user?.email || null;
  const emailData = {
    to: userEmail,
    from: "prathmeshkumbhar154@gmail.com",
    subject: "Your Shopping List from Cookbook-Pro",
    text: formattedEmailBody,
    html: formattedEmailBody.replace(/\n/g, "<br>"), // optional HTML
  };

  try {
    const response = await fetch("/api/sendMail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailData),
    });

    const result = await response.json();
    if (result.success) {
      console.log("Email sent successfully");
    } else {
      console.error("Error sending email:", result.error);
    }
  } catch (err) {
    console.error("Error sending email:", err);
  }
};
