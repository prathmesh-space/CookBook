import React from "react";
import GeneratedMealCard from "./GeneratedMealCard";

const GptResponseRenderer = ({ response, loading }) => {
  return (
    <div id="gpt-response-container">
      {loading && (
          <svg className="circle" viewBox='0 0 100 100' width='75' height='75'>
          <circle transform='rotate(0)' transform-origin='center' fill='#2d4855' cx='50' cy='50' r='20'>
             <animateTransform
                attributeName='transform'
                type='scale'
                values='1;.5;1'
                keyTimes="0; 0.8; 1"
                dur='2'
                repeatCount='indefinite'>
             </animateTransform>
          </circle>
        </svg>
        )}
      {Array.isArray(response?.recipes) && (
      <div id="response-container-label">
        Here are some recipes based on your Saved Recipes preferences:
      </div>
      )}
      <div id="response-container">
        {Array.isArray(response?.recipes) &&
          response.recipes.map((recipe, index) => (
            <GeneratedMealCard key={index} recipe={recipe} />
          ))}
      </div>
    </div>
  );
};

export default GptResponseRenderer;