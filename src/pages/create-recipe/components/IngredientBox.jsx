import React from "react";
import IngredientRow from "./IngredientRow.jsx";
import "../create-recipe.css";

const IngredientBox = ({
  ingredients,
  setIngredients,
  handleIngredientSubmit,
  addIngredient,
  removeIngredient,
  selectedIngredientData,
  setSelectedIngredientData,
  invalidFields,
}) => {
  const ingredientFields = [
    {
      name: "amount",
      label: "Amount",
      type: "text",
      placeholder: "Enter amount",
      defaultValue: 1,
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter ingredient name",
    },
    {
      name: "unit",
      label: "Unit",
      type: "select",
      placeholder: "Select unit",
      options: [
        { value: "g", label: "Grams" },
        { value: "ml", label: "Milliliters" },
        { value: "cup", label: "Cup" },
        { value: "tsp", label: "Teaspoon" },
        { value: "tbsp", label: "Tablespoon" },
      ],
    },
  ];

  return (
    <div id="ingredient-container">
      <div id="ingredient-title-container">
        <div id="ingredient-title" className="creation-title">
          Ingredient Information:
        </div>
        <button
          className="ingredient-creation-button"
          type="button"
          onClick={addIngredient}
        >
          Add Ingredient
        </button>
      </div>
      <div id="ingredient-list-container">
        {ingredients.map((ingredient, index) => (
          <IngredientRow
            key={ingredient.id}
            ingredient={ingredient}
            index={index}
            ingredientFields={ingredientFields}
            setIngredients={setIngredients}
            handleIngredientSubmit={handleIngredientSubmit}
            removeIngredient={removeIngredient}
            showRemoveButton={ingredients.length > 1}
            invalidFields={invalidFields}
          />
        ))}
      </div>
    </div>
  );
};

export default IngredientBox;
