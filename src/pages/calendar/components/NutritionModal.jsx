import React from "react";
import Modal from "react-modal";
import Health from "../../health/Health";
import DisplayRecipeMacros from "../../health/components/DisplayRecipeMacros";
import { Col } from "react-bootstrap";
import "../nutritionModalStyle.css";

const NutritionModal = ({ isOpen, closeModal, recipes, selectedDates }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Nutrition Report"
      id="nutrition-modal"
      overlayClassName="nutrition-modal-overlay"
      ariaHideApp={false}
    >
      <div className="nutrition-modal-content">
        <h2 className="nutrition-title">Nutrition Report</h2>
        {/* Add your nutrition report content here */}
        <Health recipes={recipes}  selectedDates={selectedDates}/>
        <br />
        <button onClick={closeModal} className="close-button-nutrition">Close</button>
      </div>
    </Modal>
  );
};

export default NutritionModal;
