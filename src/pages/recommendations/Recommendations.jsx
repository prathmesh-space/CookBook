import React, { useState } from "react";
import GPT from "./components/GPT";
import GptResponseRenderer from "./components/GptResponseRenderer";
import "./recommendations.css";

const Recommendations = () => {
  const [recipeType, setRecipeType] = useState("");
  const { response, error, loading, handleSubmit } = GPT();

  const isButtonActive = (type) => recipeType === type;

  const handleRecipeTypeClick = (type) => {
    setRecipeType(type);
  };

  const handleGenerateRecipe = () => {
    handleSubmit(recipeType);
  };

  return (
    <div id="recommendations-container">
      <div id="recommendations-header">
        <div id="recommendations-heading">Generate Recipes from ChatGPT</div>
        <div id="recipe-selection-container">
          <p id="text">What should I make for ..?</p>
          <button
            className={`recipe-type-button ${
              isButtonActive("Breakfast") ? "active" : ""
            }`}
            onClick={() => handleRecipeTypeClick("Breakfast")}
          >
            Breakfast
          </button>
          <button
            className={`recipe-type-button ${
              isButtonActive("Lunch") ? "active" : ""
            }`}
            onClick={() => handleRecipeTypeClick("Lunch")}
          >
            Lunch
          </button>
          <button
            className={`recipe-type-button ${
              isButtonActive("Dinner") ? "active" : ""
            }`}
            onClick={() => handleRecipeTypeClick("Dinner")}
          >
            Dinner
          </button>
          <button className={'generate-button'} onClick={handleGenerateRecipe}>Generate Recipe</button>
        </div>
      </div>
      <div id="center-content">
        {error && <div>Error: {error}</div>}
        <GptResponseRenderer response={response} loading={loading} />
      </div>
    </div>
  );
};

export default Recommendations;
