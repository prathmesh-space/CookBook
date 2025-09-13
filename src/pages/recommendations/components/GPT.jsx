import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import FirestoreService from "../../../firebase/FirebaseService.js";
import { useAuth } from "../../../utils/AuthContext.js";

// Setup Gemini client
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const textModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const GPT = () => {
  const [response, setResponse] = useState("");
  const [recipeNames, setRecipeNames] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (recipeType) => {
    setLoading(true);
    setError("");
    setResponse("");

    if (!user || !user.uid) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    const processResponseObject = (responseObject) => {
      if (!responseObject || !Array.isArray(responseObject.recipes)) {
        return null;
      }

      const processedRecipes = responseObject.recipes.map((recipe) => {
        const processedIngredients = recipe.ingredients.map((ingredientString) => {
          const ingredientRegex = /(\d+(?:\.\d+)?)\s*(\w+)?\s*(.+)/;
          const match = ingredientString.match(ingredientRegex);

          if (match) {
            const [_, amount, unit, name] = match;
            return {
              name: name.trim(),
              amount: parseFloat(amount),
              unit: unit ? unit.trim() : "",
            };
          } else {
            console.warn("Unexpected ingredient format:", ingredientString);
            return null;
          }
        });

        return {
          name: recipe.name,
          summary: recipe.summary,
          servings: recipe.servings,
          ingredients: processedIngredients.filter((i) => i !== null),
          cuisine: recipe.cuisine,
          dishType: recipe.dishType,
          image: "generatedRecipes",
          id: `gpt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          savedRecipeInspiration: recipe.savedRecipeInspiration,
          inspirationReasoning: recipe.inspirationReasoning,
        };
      });

      return { recipes: processedRecipes };
    };

    const getSavedRecipes = async () => {
      const collectionPath = `Users/${user.uid}/SavedRecipes`;
      try {
        const allDocuments = await FirestoreService.getAllDocuments(
          collectionPath,
          "recipes"
        );
        return allDocuments.map((doc) => doc.data.name);
      } catch (error) {
        console.error("Error fetching saved recipes:", error);
        throw new Error("Failed to fetch saved recipes.");
      }
    };

    try {
      const recipeNames = await getSavedRecipes();
      setRecipeNames(recipeNames);

      const json_example = {
        cuisine: "string",
        dishType: "Breakfast | Lunch | Dinner",
        id: "unique_id",
        ingredients: [
          "2 cups flour",
          "1 cup sugar",
          "3 eggs",
        ],
        name: "Dish name",
        servings: 2,
        summary: "A short summary.",
        savedRecipeInspiration: "Existing saved recipe",
        inspirationReasoning: "Reasoning behind recipe",
      };

      const recipeListString = recipeNames.join(", ");
      const prompt = `
You are a recipe recommendation system. 
Generate exactly 4 ${recipeType} recipes inspired by these saved recipes: ${recipeListString}.
Return ONLY valid JSON in the following structure, with no markdown, no explanation, no text outside the JSON:

{
  "recipes": [
    ${JSON.stringify(json_example, null, 2)}
  ]
}
      `;

      // Call Gemini text model
      const completion = await textModel.generateContent(prompt);
      let text = completion.response.text();

      console.log("Raw Gemini output:", text);

      // 🔧 Extract only JSON part
      const firstBrace = text.indexOf("{");
      const lastBrace = text.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1) {
        text = text.slice(firstBrace, lastBrace + 1);
      }

      const responseObject = JSON.parse(text);
      const processedResponse = processResponseObject(responseObject);
      setResponse(processedResponse);
    } catch (error) {
      setError("Error: " + error.message);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, handleSubmit };
};

export default GPT;
