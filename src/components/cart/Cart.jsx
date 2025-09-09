import React, { useState } from "react";
import { Modal, Button } from "reactstrap";
import RecipeDetails from "../RecipeDetails.jsx";
import OrderManager from "./OrderManager.jsx";
import { useAuth } from "../../utils/AuthContext";
import FirestoreService from "../../firebase/FirebaseService.js";
import customRecipeImage from "../../imgs/custom-recipe-placeholder.png";
import generatedRecipeImage from "../../imgs/generated-recipe-placeholder.png";

const Cart = ({ modalOpen, setModalOpen, cartItems, type }) => {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const { user } = useAuth();
  //if the cart is being used from the calendar, change the path so the real cart isn't affected
  const userCartPath =
    type === "calendar"
      ? `Users/${user.uid}/CalendarCart`
      : `Users/${user.uid}/Cart`;

  const buttonOptions = ({ isClicked, cartClick, saveData }) => (
    <Button color="secondary" onClick={() => setSelectedMeal(null)}>
      Close
    </Button>
  );

  const removeFromCart = async (recipeId) => {
    await FirestoreService.deleteDocument(userCartPath, recipeId, "recipe");
  };

  //for getting count of each recipe in cart
  const cartItemsWithCount = cartItems.reduce((acc, recipe) => {
    if (acc[recipe.id]) {
      acc[recipe.id].count += 1;
    } else {
      acc[recipe.id] = { ...recipe, count: 1 };
    }
    return acc;
  }, {});

  return (
    <Modal
      isOpen={modalOpen}
      toggle={() => setModalOpen(!modalOpen)}
      className="cart-modal"
    >
      <div className="cart">
        <div className="cart-header">
          <h2>Cart ({cartItems.length})</h2>
          <Button
            className="close-button"
            onClick={() => setModalOpen(!modalOpen)}
          >
            Close
          </Button>
        </div>
        <div className="items-in-cart">
          {Object.entries(cartItemsWithCount).map(([id, recipe]) => (
            <div key={id} className="cart-display">
              <img
                style={{ backgroundColor: "#f0f0f0", borderRadius: "8px" }}
                src={
                  recipe.image === "generatedRecipes"
                    ? generatedRecipeImage
                    : recipe.image
                    ? recipe.image
                    : customRecipeImage
                }
                alt={recipe.name}
              />
              <div>
                <h4 className="recipe-name">{recipe.name}</h4>
                <p>Quantity: {recipe.count}</p>
              </div>
              <button
                className="details-button"
                onClick={() => setSelectedMeal(recipe)}
              >
                Details
              </button>
              {type !== "calendar" && (
                <button
                  className="remove-button"
                  onClick={() => removeFromCart(id)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <OrderManager
          cartItems={cartItems}
          setModalOpen={setModalOpen}
          removeFromCart={removeFromCart}
        />
      </div>
      {selectedMeal && (
        <RecipeDetails
          meal={selectedMeal}
          isOpen={selectedMeal !== null}
          buttonOptions={buttonOptions}
        />
      )}
    </Modal>
  );
};

export default Cart;
