import React, { useState, useEffect } from "react";
import { ListGroup, ListGroupItem, Button } from "reactstrap";
import RecipeDetails from "../RecipeDetails.jsx";
import { useAuth } from "../../utils/AuthContext.js";
import FirestoreService from "../../firebase/FirebaseService.js";
import EmptyCollectionMessage from "./EmptyCollectionMessage.jsx";
import FirestoreListener from "../../firebase/FirestoreListener.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faCartShopping,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

const GeneratedMeals = () => {
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const { user } = useAuth();
  const firestoreListener = new FirestoreListener();

  useEffect(() => {
    if (user) {
      const userGeneratedRecipesPath = `Users/${user.uid}/generatedRecipes`;

      const unsubscribeFromGeneratedRecipes =
        firestoreListener.subscribeToCollection(
          userGeneratedRecipesPath,
          (docs) => {
            const recipes = docs.map((doc) => doc);
            setGeneratedRecipes(recipes);
          }
        );

      // Cleanup function
      return unsubscribeFromGeneratedRecipes;
    }
  }, [user]);

  async function unsaveRecipeFromCurrentUser(
    collectionPath,
    documentId,
    dataType
  ) {
    selectedMeal.isSaved = false;
    try {
      await FirestoreService.deleteDocument(
        collectionPath,
        documentId,
        dataType
      );
      setGeneratedRecipes(
        generatedRecipes.filter((recipe) => recipe.id !== documentId)
      );
    } catch (error) {
      console.error("Error deleting the document:", error);
    }
  }

  async function saveData(collectionPath, documentId, data, dataType) {
    const savedMeal = data;
    savedMeal.isSaved = true;
    //savedMeal.instructions kept showing up as null, preventing the recipes from being saved
    if (savedMeal.instructions === undefined) {
      savedMeal.instructions = "";
    }

    // Build the path here with the context provided by the current user
    try {
      await FirestoreService.createDocument(
        collectionPath,
        documentId,
        savedMeal,
        dataType
      );
    } catch (error) {
      console.error("Error creating document:", error);
    }
  }

  const buttonOptions = ({ isClicked, cartClick, saveData }) => (
    <>
      <Button
        color="primary"
        onClick={() => {
          unsaveRecipeFromCurrentUser(
            `Users/${user.uid}/generatedRecipes/`,
            String(selectedMeal.id),
            "gptResponse"
          );
          setSelectedMeal(null);
        }}
      >
        Unsave recipe
      </Button>
      <Button
        className={`primary-color card-button ${isClicked ? "clicked" : ""}`}
        onClick={() => {
          cartClick();
          const sanitizedMeal = {
            cuisine: selectedMeal.cuisine,
            dishType: selectedMeal.dishType,
            id: selectedMeal.id,
            image: selectedMeal.image || "",
            ingredients: selectedMeal.ingredients,
            instructions: selectedMeal.instructions,
            name: selectedMeal.name,
            servings: selectedMeal.servings,
            summary: selectedMeal.summary,
            isSaved: selectedMeal.isSaved,
          };
          saveData(
            `Users/${user.uid}/Cart/`,
            String(sanitizedMeal.id),
            sanitizedMeal,
            "recipe"
          );
        }}
        style={{ width: "7rem" }}
      >
        <div>
          <span className="add-to-cart">Add to Cart</span>
          <span className="added">Added</span>
          <FontAwesomeIcon icon={faCartShopping} />
          <FontAwesomeIcon icon={faBox} />
        </div>
      </Button>
      <Button color="secondary" onClick={() => setSelectedMeal(null)}>
        Close
      </Button>
    </>
  );

  return (
    <ListGroup className="user-recipe-viewer-list-group">
      {selectedMeal && (
        <RecipeDetails
          meal={selectedMeal}
          isOpen={selectedMeal !== null}
          toggle={() => setSelectedMeal(null)}
          buttonOptions={buttonOptions}
          saveData={saveData}
        />
      )}
      {generatedRecipes.length === 0 ? (
        <EmptyCollectionMessage
          collectionName="Generated Recipes"
          href="/recommendations"
        />
      ) : (
        generatedRecipes.map((recipe, key) => {
          return (
            <ListGroupItem
              action
              onClick={() => setSelectedMeal(recipe)}
              key={key}
            >
              {recipe.name}
            </ListGroupItem>
          );
        })
      )}
    </ListGroup>
  );
};

export default GeneratedMeals;
