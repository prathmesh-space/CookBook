import React from "react";
import MappedInputFieldsForm from "./MappedInputFieldsForm.jsx";
import "../create-recipe.css";

const RecipeBox = ({
  recipeFormData,
  setRecipeFormData,
  handleSubmitRecipe,
  invalidFields,
}) => {
  const recipeFields = [
    {
      name: "cuisine",
      label: "Cuisine",
      type: "text",
      placeholder: "Enter cuisine type",
    },
    {
      name: "dishType",
      label: "Dish Type",
      type: "select",
      placeholder: "Select unit",
      options: [
        { value: "Breakfast", label: "Breakfast" },
        { value: "Lunch", label: "Lunch" },
        { value: "Dinner", label: "Dinner" },
      ],
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter recipe name",
    },
    {
      name: "servings",
      label: "Servings",
      type: "number",
      placeholder: "Enter number of servings",
      defaultValue: "1",
      min: "1",
    },
    {
      name: "summary",
      label: "Summary",
      type: "textarea",
      placeholder: "Enter recipe summary",
    },
  ];

  return (
    <div id="recipe-container">
      <div className="creation-title">Recipe Information:</div>
      <MappedInputFieldsForm
        className={"recipe-creation-"}
        fields={recipeFields}
        formData={recipeFormData}
        defaultValues={{ servings: 1 }}
        onChange={(e) =>
          setRecipeFormData({
            ...recipeFormData,
            [e.target.name]: e.target.value,
          })
        }
        invalidFields={invalidFields}
      />
      <button
        className="create-recipe-button"
        type="button"
        onClick={handleSubmitRecipe}
      >
        Submit Recipe
      </button>
    </div>
  );
};

export default RecipeBox;
