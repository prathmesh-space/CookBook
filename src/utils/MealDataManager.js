// MealDataManager handles generating meal data from Spoonacular API and FirebaseDB
import { Recipe } from "../customObjects/Recipe.js";
import { Ingredient } from "../customObjects/Ingredient.js";

class MealDataManager {
  constructor() {
    this.spoonacularURL = new URL("https://api.spoonacular.com/recipes");
    this.spoonacularApi = process.env.REACT_APP_SPOONACULAR_API_KEY;
    if (!this.spoonacularApi) {
      console.warn(
        "⚠️ Spoonacular API key is missing! Add it to your .env file as REACT_APP_SPOONACULAR_API_KEY"
      );
    } else {
      console.log("Spoonacular API Key loaded ✅");
    }
  }

  /** Utility: check API key exists */
  _checkApiKey() {
    if (!this.spoonacularApi) {
      console.error("Spoonacular API key is missing or undefined!");
      return false;
    }
    return true;
  }

  /** Query Spoonacular recipes */
  async queryRecipeFromSpoonacular(query, offset = 0) {
    if (!this._checkApiKey()) return { resultsList: [], totalResults: 0 };
    if (!query || query.trim() === "") {
      console.warn("Query is empty. Returning 0 results.");
      return { resultsList: [], totalResults: 0 };
    }

    const params = new URLSearchParams({
      apiKey: this.spoonacularApi,
      query,
      addRecipeInformation: true,
      offset,
      number: 20,
      fillIngredients: true,
    });

    const fullUrl = `${this.spoonacularURL}/complexSearch?${params.toString()}`;
    console.log("Fetching Spoonacular recipes from URL:", fullUrl);

    try {
      const response = await fetch(fullUrl);

      if (!response.ok) {
        console.error(
          `Spoonacular API error: ${response.status} ${response.statusText}`
        );
        const errorData = await response.json().catch(() => null);
        if (errorData) console.error("API response:", errorData);
        return { resultsList: [], totalResults: 0 };
      }

      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        console.warn("No results returned from Spoonacular:", data);
        return { resultsList: [], totalResults: data.totalResults || 0 };
      }

      const searchResultsList = data.results.map((recipe) => {
        const mappedIngredients = (recipe.extendedIngredients || []).map(
          (ing) =>
            new Ingredient(
              ing.amount,
              ing.id,
              ing.nameClean || ing.name,
              ing.unit
            )
        );

        return new Recipe(
          recipe.cuisines || [],
          recipe.dishTypes || [],
          recipe.id,
          recipe.image || "",
          mappedIngredients,
          recipe.analyzedInstructions || [],
          recipe.title || "",
          recipe.servings || 0,
          recipe.summary || ""
        );
      });

      console.log(
        `Fetched ${searchResultsList.length} recipes, totalResults: ${data.totalResults}`
      );

      return { resultsList: searchResultsList, totalResults: data.totalResults || 0 };
    } catch (error) {
      console.error("Error fetching recipes from Spoonacular:", error);
      return { resultsList: [], totalResults: 0 };
    }
  }

  /** Search ingredients in Spoonacular */
  async searchIngredients(query, number = 25) {
    if (!this._checkApiKey()) return { results: [], totalResults: 0 };
    if (!query || query.trim() === "") {
      console.warn("Ingredient search query is empty. Returning 0 results.");
      return { results: [], totalResults: 0 };
    }

    const params = new URLSearchParams({
      apiKey: this.spoonacularApi,
      query,
      number: number.toString(),
    });

    const url = `https://api.spoonacular.com/food/ingredients/search?${params.toString()}`;
    console.log("Fetching Spoonacular ingredients from URL:", url);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        console.error(
          `Spoonacular API error: ${response.status} ${response.statusText}`
        );
        const errorData = await response.json().catch(() => null);
        if (errorData) console.error("API response:", errorData);
        return { results: [], totalResults: 0 };
      }

      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        console.warn("No ingredients found:", data);
        return { results: [], totalResults: data.totalResults || 0 };
      }

      const results = data.results.map(
        (result) => new Ingredient(null, result.id, result.name, null, result.image || null)
      );

      console.log(`Fetched ${results.length} ingredients, totalResults: ${data.totalResults}`);

      return { results, totalResults: data.totalResults || 0 };
    } catch (error) {
      console.error("Error searching ingredients:", error);
      return { results: [], totalResults: 0 };
    }
  }

  /** Fetch nutrition info for a recipe */
  async fetchRecipeDetails(recipeId) {
    if (!this._checkApiKey()) return null;

    const params = new URLSearchParams({ apiKey: this.spoonacularApi });
    const url = `${this.spoonacularURL}/${recipeId}/nutritionWidget.json?${params.toString()}`;
    console.log("Fetching recipe nutrition details from URL:", url);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Spoonacular nutrition API error: ${response.status} ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      let sugar = "N/A";
      for (const item of data.bad || []) {
        if (item.title === "Sugar") sugar = item.amount;
      }

      return {
        calories: parseFloat(data.calories) || 0,
        carbohydrates: parseFloat(data.carbs) || 0,
        protein: parseFloat(data.protein) || 0,
        sugar: sugar !== "N/A" ? parseFloat(sugar) : "N/A",
        fat: parseFloat(data.fat) || 0,
      };
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      return null;
    }
  }

  /** Get a random meal from Spoonacular */
  async getRandomMeal() {
    if (!this._checkApiKey()) return null;

    const params = new URLSearchParams({ apiKey: this.spoonacularApi, number: "1" });
    const url = `${this.spoonacularURL}/random?${params.toString()}`;
    console.log("Fetching random meal from URL:", url);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Spoonacular random meal API error: ${response.status} ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      const recipe = (data.recipes && data.recipes[0]) || null;
      if (!recipe) {
        console.warn("No random recipe returned from Spoonacular.");
        return null;
      }

      const ingredients = (recipe.extendedIngredients || []).map(
        (ing) => new Ingredient(
          ing.amount,
          ing.id,
          ing.nameClean || ing.name,
          ing.unit
        )
      );

      return new Recipe(
        recipe.cuisines || [],
        recipe.dishTypes || [],
        recipe.id,
        recipe.image || "",
        ingredients,
        recipe.analyzedInstructions || [],
        recipe.title || "",
        recipe.servings || 0,
        recipe.summary || ""
      );
    } catch (error) {
      console.error("Error fetching random meal:", error);
      return null;
    }
  }
}

export default MealDataManager;
