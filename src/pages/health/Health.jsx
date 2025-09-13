import React, { useState, useEffect } from "react";
import DisplayGoals from "./components/DisplayGoals.jsx";
import MacroGoalForm from "./components/MacroGoalForm.jsx";
import { useAuth } from "../../utils/AuthContext.js";
import FirestoreListener from "../../firebase/FirestoreListener.js";
import MealDataManager from "../../utils/MealDataManager.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Tooltip,
} from "recharts";
import "./health.css";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const Health = ({ recipes = [], selectedDates = 1 }) => {
  const { user } = useAuth();
  const firestoreListener = new FirestoreListener();
  const mealDataManager = new MealDataManager();

  const [showGoals, setShowGoals] = useState(true);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [totalMacros, setTotalMacros] = useState({
    calories: 0,
    carbohydrates: 0,
    protein: 0,
    sugar: 0,
    fat: 0,
  });
  const [recipeNutritionData, setRecipeNutritionData] = useState([]);
  const [macroBreakdownData, setMacroBreakdownData] = useState([
    { name: "Carbohydrates", value: 0, fill: "#FFA500" },
    { name: "Protein", value: 0, fill: "#006400" },
    { name: "Sugar", value: 0, fill: "#FF0000" },
    { name: "Fat", value: 0, fill: "#00008B" },
  ]);
  const [userGoals, setUserGoals] = useState({
    calories: 0,
    carbs: 0,
    protein: 0,
    sugar: 0,
    fat: 0,
  });

  // Progress data for bar chart
  const progressData = [
    {
      name: "Calories",
      Goals: userGoals.calories * selectedDates,
      Planned: totalMacros.calories,
    },
    {
      name: "Carbs",
      Goals: userGoals.carbs * selectedDates,
      Planned: totalMacros.carbohydrates,
    },
    {
      name: "Protein",
      Goals: userGoals.protein * selectedDates,
      Planned: totalMacros.protein,
    },
    {
      name: "Sugar",
      Goals: userGoals.sugar * selectedDates,
      Planned: totalMacros.sugar,
    },
    {
      name: "Fat",
      Goals: userGoals.fat * selectedDates,
      Planned: totalMacros.fat,
    },
  ];

  // Listen to health goals from Firestore
  useEffect(() => {
    if (!user) return;

    const path = `Users/${user.uid}/Health/${user.uid}.HealthGoals`;
    const callback = (snapshot) => {
      if (snapshot.exists()) {
        setUserGoals(snapshot.data());
        setShowGoals(true);
      } else {
        setShowGoals(false);
      }
    };

    firestoreListener.subscribeToDocument(path, callback);
    return () => firestoreListener.unsubscribe();
  }, [user]);

  // ✅ Fixed fetchAllRecipeDetails
  const fetchAllRecipeDetails = async () => {
    if (!recipes || recipes.length === 0) {
      console.warn("No recipes provided!");
      return;
    }

    setButtonClicked(true);

    try {
      let newTotalMacros = {
        calories: 0,
        carbohydrates: 0,
        protein: 0,
        sugar: 0,
        fat: 0,
      };
      let newRecipeNutritionData = [];

      for (const recipe of recipes) {
        if (!recipe.id) continue;

        const recipeDetails = await mealDataManager.fetchRecipeDetails(recipe.id);
        console.log("Fetched recipe:", recipe.name, recipeDetails);

        if (!recipeDetails) continue;

        newTotalMacros = {
          calories: newTotalMacros.calories + (recipeDetails.calories || 0),
          carbohydrates:
            newTotalMacros.carbohydrates + (recipeDetails.carbohydrates || 0),
          protein: newTotalMacros.protein + (recipeDetails.protein || 0),
          sugar: newTotalMacros.sugar + (recipeDetails.sugar || 0),
          fat: newTotalMacros.fat + (recipeDetails.fat || 0),
        };

        newRecipeNutritionData.push({
          name: recipe.name,
          ...recipeDetails,
        });
      }

      setTotalMacros(newTotalMacros);
      setRecipeNutritionData(newRecipeNutritionData);

      setMacroBreakdownData([
        { name: "Carbohydrates", value: newTotalMacros.carbohydrates, fill: "#FFA500" },
        { name: "Protein", value: newTotalMacros.protein, fill: "#006400" },
        { name: "Sugar", value: newTotalMacros.sugar, fill: "#FF0000" },
        { name: "Fat", value: newTotalMacros.fat, fill: "#00008B" },
      ]);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    } finally {
      setButtonClicked(false); // Re-enable button
    }
  };

  return (
    <div className="vert-column-container">
      <div id="column-one">
        <div className="explainations">
          <h2>Tips for filling in Macros</h2>
          <h6>Hover over each category for more information</h6>
          <p>
            <Tippy content="To maintain weight, aim for your daily energy expenditure. For weight loss, aim for a deficit of 500 calories per day.">
              <strong>CALORIES</strong>
            </Tippy>
          </p>
          <p>
            <Tippy content="To build muscle, aim for 1 gram per pound of body weight. For general health, aim for 0.36 grams per pound.">
              <strong>PROTEIN</strong>
            </Tippy>
          </p>
          <p>
            <Tippy content="For an active lifestyle, aim for 3-5 grams per kilogram of body weight. For weight loss, aim for the lower end of this range.">
              <strong>CARBOHYDRATES</strong>
            </Tippy>
          </p>
          <p>
            <Tippy content="For general health, aim for 20-35% of your total daily calories. For a ketogenic diet, aim for 70-75% of your total daily calories.">
              <strong>FAT</strong>
            </Tippy>
          </p>
          <p>
            <Tippy content="For a healthy diet, aim for less than 10% of your total daily calories from added sugars. For optimal health, aim for less than 5%.">
              <strong>SUGAR</strong>
            </Tippy>
          </p>
        </div>
        <br />
        {showGoals ? (
          <DisplayGoals onEdit={() => setShowGoals(false)} />
        ) : (
          <MacroGoalForm onSubmit={() => setShowGoals(true)} />
        )}
      </div>

      <div id="column-two">
        <div>
          <h3>Total Macros from selected days:</h3>
          <p>Calories: {totalMacros.calories} cals</p>
          <p>Carbohydrates: {totalMacros.carbohydrates} g</p>
          <p>Protein: {totalMacros.protein} g</p>
          <p>Sugar: {totalMacros.sugar} g</p>
          <p>Fat: {totalMacros.fat} g</p>
        </div>
        <div>
          <h3>Recipes for selected range: </h3>
          <ul>
            {recipeNutritionData.map((recipe, index) => (
              <li key={index}>
                <b>{recipe.name}</b> - Calories: {recipe.calories} cals, Carbs: {recipe.carbohydrates} g, Protein: {recipe.protein} g, Sugar: {recipe.sugar} g, Fat: {recipe.fat} g
              </li>
            ))}
          </ul>
        </div>
        <div>
          <button onClick={fetchAllRecipeDetails} disabled={buttonClicked}>
            {buttonClicked ? "Loading..." : "Show Results"}
          </button>
        </div>
      </div>

      <div id="column-three">
        {totalMacros.calories > 0 && (
          <div id="inside-column-three">
            <div>
              <h1>Macronutrient Breakdown</h1>
              <PieChart width={500} height={300}>
                <Pie
                  dataKey="value"
                  isAnimationActive={false}
                  data={macroBreakdownData}
                  cx={200}
                  cy={200}
                  outerRadius={80}
                  label
                  stroke="black"
                  strokeWidth={2}
                />
                <Tooltip />
              </PieChart>
            </div>
            <div>
              <h1>Progress vs Goals</h1>
              <BarChart width={500} height={300} data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Goals" fill="green" />
                <Bar dataKey="Planned" fill="black" />
              </BarChart>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Health;
