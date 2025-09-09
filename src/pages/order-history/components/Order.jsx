import React, { useState } from "react";
import "../order-history.css";

const Order = ({ recipeNames, ingredients, orderId }) => {
  const addClickedProperty = (ingredients) => {
    return ingredients.map((ingredient) => ({ ...ingredient, clicked: false }));
  };

  const [expanded, setExpanded] = useState(false);
  const [parsedIngredients, setIngredients] = useState(
    addClickedProperty(ingredients),
  );

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleItemClick = (index) => {
    const updatedIngredients = [...parsedIngredients];
    updatedIngredients[index].clicked = !updatedIngredients[index].clicked;
    setIngredients(updatedIngredients);
  };

  //getting count of each recipe
  const recipeNamesWithCount = recipeNames.reduce((acc, recipeName) => {
    if (acc[recipeName]) {
      acc[recipeName] += 1;
    } else {
      acc[recipeName] = 1;
    }
    return acc;
  }, {});

  const convertEpochTSToLocaleString = (orderId) => {
    const timestamp = Number(orderId.split('-')[1]);
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="order-container">
      <div className="clickable-area-header" onClick={toggleExpand}>
        <h2>Order Details {convertEpochTSToLocaleString(orderId)}</h2>
      </div>
      <div
        className="expand-content"
        style={{ maxHeight: expanded ? "fit-content" : "0" }}
      >
        <div className="recipe-names">
          <h3>Recipe Names</h3>
          <ul>
            {Object.entries(recipeNamesWithCount).map(([recipeName, count]) => (
              <li key={recipeName}>
                {recipeName} (Quantity: {count})
              </li>
            ))}
          </ul>
        </div>
        <div className="ingredients">
          <h3>Ingredients</h3>
          <ul>
            {ingredients &&
              Array.isArray(parsedIngredients) &&
              parsedIngredients.map((ingredient, index) => (
                <li
                  key={index}
                  style={{
                    textDecoration: ingredient.clicked
                      ? "line-through"
                      : "none",
                    cursor: "pointer",
                  }}
                  onClick={() => handleItemClick(index)}
                >
                  {typeof ingredient === "object"
                    ? `${ingredient.name} (${ingredient.amount} ${ingredient.unit})`
                    : ingredient}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Order;
