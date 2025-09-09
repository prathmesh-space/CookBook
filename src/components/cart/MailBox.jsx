import { useEffect, useRef } from "react";
import { useAuth } from "../../utils/AuthContext";

const MailBox = ({ orderData }) => {
  const { user } = useAuth();
  const emailSent = useRef(false);
  const currentOrderData = useRef(null);

  const formattedEmailBody = formatOrderDataToMarkdown(orderData);

  const sendMail = async () => {
    const userEmail = user?.email;
    if (!userEmail) return;

    try {
      const res = await fetch("/api/sendMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: userEmail,
          from: "prathmeshkumbhar154@gmail.com",
          subject: "Your Shopping List from Cookbook-Pro",
          text: formattedEmailBody,
        }),
      });

      const data = await res.json();
      console.log("Email sent:", data);
      emailSent.current = true;
    } catch (err) {
      console.error("Error sending email:", err);
    }
  };

  useEffect(() => {
    if (orderData !== currentOrderData.current && !emailSent.current) {
      sendMail();
      currentOrderData.current = orderData;
    }
  }, [orderData]);

  return null;
};

const formatOrderDataToMarkdown = (orderData) => {
  if (!orderData) return "";

  const { recipeNames, ingredients } = orderData;

  const formattedRecipeNames = recipeNames.map(r => `- ${r}`).join("\n");

  const formattedIngredients = ingredients
    .map((ing) => {
      const unit = ing.unit.trim() || "serving";
      return `- [ ] ${ing.amount} ${unit} of ${ing.name}`;
    })
    .join("\n");

  return `
Recipes from your cart:
${formattedRecipeNames}

Ingredient Checklist for Recipes:
${formattedIngredients}
`;
};

export default MailBox;
