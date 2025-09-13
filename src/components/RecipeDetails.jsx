import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import DOMPurify from "dompurify";

/**
 * RecipeDetails modal component
 * @param {Object} props
 * @param {Recipe} props.meal - Recipe object containing details
 * @param {Function} props.buttonOptions - Function returning JSX for buttons
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.saveData - Optional save handler
 */
const RecipeDetails = ({ meal, buttonOptions, isOpen, saveData }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleCartClick = () => setIsClicked(true);

  if (!meal) return null;

  const filteredMeal = {
    summary: meal.summary || "No summary available.",
    ingredients: meal.ingredients || [],
  };

  return (
    <Modal
      isOpen={isOpen}
      style={{ maxWidth: "40rem" }}
      className="modal-window"
    >
      <ModalHeader className="modal-header">{meal.name || "Recipe Details"}</ModalHeader>

      <ModalBody
        className="modal-body"
        style={{ maxHeight: "25rem", overflowY: "auto" }}
      >
        {/* Summary */}
        <div
          style={{ wordBreak: "break-word", marginBottom: "10px" }}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(filteredMeal.summary, { ALLOWED_TAGS: ["b", "a"] }),
          }}
        />

        {/* Ingredients */}
        <div style={{ marginBottom: "10px" }}>
          <strong>Ingredients:</strong>
          <ul>
            {filteredMeal.ingredients.map((ingredient, index) =>
              ingredient ? (
                <li key={index}>
                  {ingredient.amount || "?"} {ingredient.unit || ""} {ingredient.name || "Unknown"}
                </li>
              ) : null
            )}
          </ul>
        </div>
      </ModalBody>

      <ModalFooter className="modal-footer">
        {buttonOptions({ isClicked, cartClick: handleCartClick, saveData })}
      </ModalFooter>
    </Modal>
  );
};

export default RecipeDetails;
