import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardImg,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import RecipeDetails from "../../../components/RecipeDetails.jsx";
import { GoogleGenerativeAI } from "@google/generative-ai";
import FirestoreService from "../../../firebase/FirebaseService";
import { useAuth } from "../../../utils/AuthContext.js";

// Setup Gemini client
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

// Use Imagen 3.0 model for images
const imageModel = genAI.getGenerativeModel({ model: "imagen-3.0" });

const GeneratedMealCard = ({ recipe }) => {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(recipe.isSaved || false);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const { user } = useAuth();

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const buttonOptions = () => (
    <Button color="secondary" onClick={() => setSelectedMeal(null)}>
      Close
    </Button>
  );

  // ✅ Generate Gemini Image properly
  const generateGeminiImage = async () => {
    try {
      setIsImageGenerating(true);

      const prompt = `Generate a photorealistic food image of "${recipe.name}". It should represent: ${recipe.summary}.`;

      const result = await imageModel.generateImages({
        prompt,
        size: "1024x1024",
      });

      if (!result.images?.length || !result.images[0].b64_json) {
        throw new Error("No image data returned from Gemini.");
      }

      const imageBase64 = result.images[0].b64_json;
      const imgUrl = `data:image/png;base64,${imageBase64}`;
      setImageURL(imgUrl);

      console.log("✅ Gemini image generated successfully");
    } catch (error) {
      console.error("❌ Error generating Gemini image:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsImageGenerating(false);
    }
  };

  // ✅ Save GPT Response to Firestore
  const saveGPTResponse = async () => {
    if (!user || !user.uid) {
      console.error("User not authenticated.");
      return;
    }

    if (isSaved) {
      console.log("Recipe already saved, skipping save.");
      return;
    }

    try {
      const collectionPath = `Users/${user.uid}/generatedRecipes`;

      const savedRecipe = {
        ...recipe,
        isSaved: true,
        ingredients: recipe.ingredients.map((ingredient) => ({
          ...ingredient,
          id: `i-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        })),
      };

      await FirestoreService.createDocument(
        collectionPath,
        savedRecipe.id,
        savedRecipe
      );

      setIsSaved(true);
      console.log("✅ Recipe saved successfully");
    } catch (error) {
      console.error("❌ Error saving GPT response:", error);
    }
  };

  return (
    <div className="meal-card">
      <div className="meal-card-content">
        <CardTitle>
          <h5 className="meal-card-title text-truncate">{recipe.name}</h5>
        </CardTitle>
        <div className="meal-card-inspiration">
          Inspired by: {recipe.savedRecipeInspiration}
        </div>
        <div className="meal-card-summary">{recipe.summary}</div>

        {imageURL && (
          <>
            <CardImg
              top
              width="100%"
              src={imageURL}
              alt="Generated Recipe Image"
              onClick={toggleModal}
              style={{ cursor: "pointer" }}
            />
            <Modal isOpen={isModalOpen} toggle={toggleModal}>
              <ModalHeader toggle={toggleModal}>{recipe.name}</ModalHeader>
              <ModalBody>
                <img
                  src={imageURL}
                  width="100%"
                  alt="Full-size Recipe Image"
                />
              </ModalBody>
            </Modal>
          </>
        )}
      </div>

      <CardBody>
        <Button
          className="meal-card-button details"
          onClick={() => setSelectedMeal({ ...recipe })}
        >
          Details
        </Button>

        <Button
          className="meal-card-button save"
          color="success"
          onClick={saveGPTResponse}
          disabled={isSaved}
        >
          {isSaved ? "Saved" : "Save"}
        </Button>

        <Button
          className="meal-card-button dalle"
          color="info"
          onClick={generateGeminiImage}
          disabled={isImageGenerating}
        >
          {isImageGenerating ? "Generating..." : "Generate Gemini Image"}
        </Button>

        <div className="meal-card-reasoning">{recipe.inspirationReasoning}</div>

        {selectedMeal && (
          <RecipeDetails
            meal={selectedMeal}
            buttonOptions={buttonOptions}
            isOpen={selectedMeal !== null}
          />
        )}
      </CardBody>
    </div>
  );
};

export default GeneratedMealCard;
