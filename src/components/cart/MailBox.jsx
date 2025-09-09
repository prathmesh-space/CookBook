import { useEffect, useRef } from "react";
import { useAuth } from "../../utils/AuthContext";

const MailBox = ({ orderData }) => {
  const { user } = useAuth();
  const emailSent = useRef(false);
  const currentOrderData = useRef(null);

  // Convert order data to Markdown text
  const formatOrderDataToMarkdown = (orderData) => {
    if (!orderData) return "";

    const { recipeNames, ingredients } = orderData;

    const formattedRecipeNames = recipeNames
      .map((recipe) => `- ${recipe}`)
      .join("\n");

    const formattedIngredients = ingredients
      .map((ingredient) => {
        const unit = ingredient.unit.trim() || "serving";
        return `- [ ] ${ingredient.amount} ${unit} of ${ingredient.name}`;
      })
      .join("\n");

    return `
Recipes from your cart:
${formattedRecipeNames}

Ingredient Checklist for Recipes:
${formattedIngredients}
`;
  };

  const sendMail = async () => {
    const userEmail = user?.email;
    if (!userEmail || !orderData) return;

    const formattedEmailBody = formatOrderDataToMarkdown(orderData);

    const emailData = {
      to: userEmail,
      from: "prathmeshkumbhar154@gmail.com",
      subject: "Your Shopping List from Cookbook-Pro",
      text: formattedEmailBody,
      html: formattedEmailBody.replace(/\n/g, "<br>"),
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
        emailSent.current = true;
      } else {
        console.error("Error sending email:", result.error);
      }
    } catch (err) {
      console.error("Error sending email:", err);
    }
  };

  useEffect(() => {
    // Send email only if orderData changed and email hasn't been sent
    if (orderData !== currentOrderData.current && !emailSent.current) {
      sendMail();
      currentOrderData.current = orderData;
    }
  }, [orderData]);

  return null; // invisible component
};

export default MailBox;
