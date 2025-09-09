import React from "react";

const GeneratedRecipeItem = ({ recipe }) => {
  return (
    <div className="response-item">
      <pre className="pre-style">
        {`Name: ${recipe.name}
Summary: ${recipe.summary}
Servings: ${recipe.servings}
Cuisine: ${recipe.cuisine}
Dish Type: ${recipe.dishType}
ID: ${recipe.id}
Saved Recipe Inspiration: ${recipe.savedRecipeInspiration}
Inspiration Reasoning: ${recipe.inspirationReasoning}

Ingredients:
${recipe.ingredients
  .map(
    (ingredient) =>
      `- ${ingredient.name} (${ingredient.amount} ${ingredient.unit})`
  )
  .join("\n")}`}
      </pre>
    </div>
  );
};

export default GeneratedRecipeItem;
