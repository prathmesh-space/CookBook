import { useEffect, useRef } from "react";
import { useAuth } from "../../utils/AuthContext";

const MailBox = ({ orderData }) => {
  const { user } = useAuth();
  const emailSent = useRef(false);
  const currentOrderData = useRef(null);

  const formattedEmailBody = formatOrderDataToMarkdown(orderData);

  const sendMail = async () => {
    const userEmail = user?.email || null;
    if (!userEmail) return;

    const emailData = {
      to: userEmail,
      from: "prathmeshkumbhar154@gmail.com", // must be verified in SendGrid
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

  useEffect(()
