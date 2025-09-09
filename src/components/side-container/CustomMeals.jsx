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

const CustomMeals = () => {
  const [savedRecipes, setSavedRecipes] = useState([""]);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const { user } = useAuth();
  const firestoreListener = new FirestoreListener();

  useEffect(() => {
    if (user) {
      const userSavedRecipesPath = `Users/${user.uid}/CustomRecipes`;

      const unsubscribeCustomRecipes = firestoreListener.subscribeToCollection(
        userSavedRecipesPath,
        (docs) => {
          const recipes = docs.map((doc) => doc);
          setSavedRecipes(recipes);
        }
      );

      // Cleanup function
      return unsubscribeCustomRecipes;
    }
  }, [user.uid]);

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
    } catch (error) {
      console.error("Error deleting the document:", error);
    }
  }

  const buttonOptions = ({ isClicked, cartClick, saveData }) => (
    <>
      <Button
        color="primary"
        onClick={() => {
          unsaveRecipeFromCurrentUser(
            `Users/${user.uid}/CustomRecipes/`,
            String(selectedMeal.id),
            "recipe"
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
          saveData(
            `Users/${user.uid}/Cart/`,
            String(selectedMeal.id),
            selectedMeal,
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
      {savedRecipes.length === 0 ? (
        <EmptyCollectionMessage
          collectionName="Custom Recipes"
          href="/create-recipe"
        />
      ) : (
        savedRecipes.map((recipe, key) => {
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

export default CustomMeals;
