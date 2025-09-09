import React, { useState } from "react";
import { useAuth } from "../../utils/AuthContext.js";
import FirestoreService from "../../firebase/FirebaseService.js";
import MailBox from "./MailBox.jsx";

const OrderManager = ({ cartItems, setModalOpen, removeFromCart }) => {
  const { user } = useAuth();
  const userOrdersPath = `Users/${user.uid}/Orders`;
  const [selectedDate, setSelectedDate] = useState(null);
  const [orderData, setOrderData] = useState(null);

  const createOrder = async () => {
    if (!cartItems || !Array.isArray(cartItems)) {
      console.log("No items in cart or cartItems is not an array");
      return;
    }

    if (!cartItems.every((item) => item.name && item.ingredients)) {
      console.log(
        "One or more items in cartItems does not have a name or ingredients"
      );
      return;
    }

    saveOrder();
  };

  const saveOrder = async () => {
    const recipesInCurrentCart = cartItems.map((item) => item.name).sort();

    const aggregateIngredients = (cartItems) => {
      const ingredientsMap = new Map();

      cartItems.forEach((item) => {
        item.ingredients.forEach((ingredient) => {
          const existingIngredient = ingredientsMap.get(ingredient.id);
          if (existingIngredient) {
            existingIngredient.amount += ingredient.amount;
          } else {
            ingredientsMap.set(ingredient.id, {
              id: ingredient.id,
              name: ingredient.name,
              unit: ingredient.unit,
              amount: ingredient.amount,
            });
          }
        });
      });

      return Array.from(ingredientsMap.values()).sort();
    };

    const orderData = {
      recipeNames: recipesInCurrentCart,
      ingredients: aggregateIngredients(cartItems),
    };

    const orderId = `o-${Date.now()}`;

    try {
      await FirestoreService.createDocument(
        userOrdersPath,
        orderId,
        orderData,
        "order"
      );
      setOrderData(orderData);
      setSelectedDate(null);
      setModalOpen(false);
      // Remove each item from the cart after order is saved
      cartItems.forEach((item) => {
        removeFromCart(item.id);
      });
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

  const handleSubmit = async () => {
    await createOrder();
  };

  return (
    <>
      <div className="submit-container">
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
      {orderData && <MailBox orderData={orderData} />}
    </>
  );
};

export default OrderManager;
