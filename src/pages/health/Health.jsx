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
  Cell,
} from "recharts";
import "./health.css";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const Health = ({ recipes, selectedDates }) => {
  // Firebase auth
  const { user } = useAuth();
  // Firestore listener
  const firestoreListener = new FirestoreListener();
  // Meal data manager for accessing Spoonacular
  const mealDataManager = new MealDataManager();
  // Toggle for prompting user for goals or displaying them
  const [showGoals, setShowGoals] = useState(true);
  // Controls visibility/clickability for button
  const [buttonClicked, setButtonClicked] = useState(false);
  // Intially set total macros
  const [totalMacros, setTotalMacros] = useState({
    calories: 0,
    carbohydrates: 0,
    protein: 0,
    sugar: 0,
    fat: 0,
  });
  // Used for setting nutrition data
  const [recipeNutritionData, setRecipeNutritionData] = useState([]);
  // Used for pie chart breakdown
  const [macroBreakdownData, setMacroBreakdownData] = useState([
    { name: "Carbohydrates", value: 0, fill: "#FFA500" },
    { name: "Protein", value: 0, fill: "#006400" },
    { name: "Sugar", value: 0, fill: "#FF0000" },
    { name: "Fat", value: 0, fill: "#00008B" },
  ]);

  // Tracks users goal for bar graph
  const [userGoals, setUserGoals] = useState({
    calories: 0,
    carbohydrates: 0,
    protein: 0,
    sugar: 0,
    fat: 0,
  });

  // Used for updating the bar graph
  const progressData = [
    {
      name: "Calories",
      Goals: userGoals.calories * selectedDates,
      Planned: totalMacros.calories,
      amt: userGoals.calories,
    },
    {
      name: "Carbs",
      Goals: userGoals.carbs * selectedDates,
      Planned: totalMacros.carbohydrates,
      Completion: (totalMacros.carbohydrates / userGoals.carbs) * 100,
    },
    {
      name: "Protein",
      Goals: userGoals.protein * selectedDates,
      Planned: totalMacros.protein,
      Completion: (totalMacros.protein / userGoals.protein) * 100,
    },
    {
      name: "Sugar",
      Goals: userGoals.sugar * selectedDates,
      Planned: totalMacros.sugar,
      Completion: (totalMacros.sugar / userGoals.sugar) * 100,
    },
    {
      name: "Fat",
      Goals: userGoals.fat * selectedDates,
      Planned: totalMacros.fat,
      Completion: (totalMacros.fat / userGoals.fat) * 100,
    },
  ];

  // Listener for tracking macro goals changes
  useEffect(() => {
    if (user) {
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

      return () => {
        firestoreListener.unsubscribe();
      };
    }
  }, []);

  // Controls the functionality of the results button
  const fetchAllRecipeDetails = async () => {
    try {
      setButtonClicked(true);

      let newTotalMacros = {
        calories: 0,
        carbohydrates: 0,
        protein: 0,
        sugar: 0,
        fat: 0,
      };

      let newRecipeNutritionData = [];

      for (const recipe of recipes) {
        const recipeDetails = await mealDataManager.fetchRecipeDetails(
          recipe.id
        );
        newTotalMacros = {
          calories: newTotalMacros.calories + recipeDetails.calories,
          carbohydrates:
            newTotalMacros.carbohydrates + recipeDetails.carbohydrates,
          protein: newTotalMacros.protein + recipeDetails.protein,
          sugar: newTotalMacros.sugar + recipeDetails.sugar,
          fat: newTotalMacros.fat + recipeDetails.fat,
        };
        newRecipeNutritionData.push({
          name: recipe.name,
          ...recipeDetails,
        });
      }

      // Update total macros and pie chart data after calculating total macros
      setTotalMacros(newTotalMacros);
      setMacroBreakdownData((prevData) =>
        prevData.map((item) => ({
          ...item,
          value: newTotalMacros[item.name.toLowerCase()],
        }))
      );
      setRecipeNutritionData(newRecipeNutritionData);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  };

  return (
    <div className="vert-column-container">
      <div id="column-one">
        <div className="explainations">
          <h2>Tips for filling in Macros</h2>
          <h6>Hover over each category for more information</h6>
          <p>
            <Tippy
              content="To maintain weight, aim for your daily
            energy expenditure. For weight loss, aim for a deficit of 500
            calories per day."
            >
              <strong>CALORIES</strong>
            </Tippy>
          </p>
          <p>
            <Tippy
              content="To build muscle, aim for 1 gram per
              pound of body weight. For general health, aim for 0.36 grams per
              pound."
            >
              <strong>PROTEIN</strong>
            </Tippy>
          </p>
          <p>
            <Tippy
              content="For an active lifestyle, aim for
              3-5 grams per kilogram of body weight. For weight loss, aim for
              the lower end of this range."
            >
              <strong>CARBOHYDRATES</strong>
            </Tippy>
          </p>
          <p>
            <Tippy
              content="For general health, aim for 20-35% of your
              total daily calories. For a ketogenic diet, aim for 70-75% of your
              total daily calories."
            >
              <strong>FAT</strong>
            </Tippy>
          </p>
          <p>
            <Tippy
              content="For a healthy diet, aim for less than 10%
              of your total daily calories from added sugars. For optimal
              health, aim for less than 5%."
            >
              <strong>SUGAR</strong>
            </Tippy>
          </p>
        </div>
        <br />
        <br />
        <br />
        {/* Either display goals or prompt user to enter them */}
        {showGoals ? (
          <DisplayGoals onEdit={() => setShowGoals(false)} />
        ) : (
          <MacroGoalForm onSubmit={() => setShowGoals(true)} />
        )}
      </div>
      <div id="column-two">
        {/* Display total macros */}
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
          <br />
          <ul>
            {recipeNutritionData.map((recipe, index) => (
              <li key={index}>
                <b>{recipe.name}</b> - Calories: {recipe.calories} cals, Carbs:{" "}
                {recipe.carbohydrates} g, Protein: {recipe.protein} g, Sugar:{" "}
                {recipe.sugar} g, Fat: {recipe.fat} g
              </li>
            ))}
          </ul>
        </div>
        <div>
          <button onClick={fetchAllRecipeDetails} disabled={buttonClicked}>
            Show Results
          </button>
        </div>
        <p>
          <strong>
            *Note: If no results are displayed after the button is pressed, you
            may have to wait a few seconds.
          </strong>
        </p>
      </div>
      {/* Conditionally render Charts if user has selected a meal */}
      <div id="column-three">
        {totalMacros.calories > 0 && (
          <div id="inside-column-three">
            <div>
              <h1>
                Your macronutrient breakdown for the selected days (grams)
              </h1>
              <p>Hover over sections of the graph for more details.</p>
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
              <br />
              <br />
              <br />
            </div>
            <div>
              <h1>Progress - How do my planned meals line up with my goals?</h1>
              <p>Hover over sections of the graph for more details.</p>
              <br />
              <BarChart
                width={500}
                height={300}
                data={progressData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
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
