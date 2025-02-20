import React, { useState, useEffect } from "react";
import "../styles/UserInfo.css";
import data from "../data";
import MacrosOverview from "./MacrosOverview";

// UserInfo component displays current macro information and allows editing them via a modal.
function UserInfo() {
  // Initialize the macros state using data from a shared "data" object.
  // If any value is undefined, it defaults to 0.
  const [macros, setMacros] = useState({
    calories: data.macros?.calories ?? 0,
    fat: data.macros?.fat ?? 0,
    protein: data.macros?.protein ?? 0,
    carbohydrate: data.macros?.carbohydrate ?? 0,
  });

  // State to control whether the macro editing modal is visible.
  const [showMacroModal, setShowMacroModal] = useState(false);

  // useEffect sets up an interval to update macros every second.
  // It ensures the displayed macros remain in sync with the "data" object.
  useEffect(() => {
    const updateMacros = () => {
      setMacros({
        calories: data.macros?.calories ?? 0,
        fat: data.macros?.fat ?? 0,
        protein: data.macros?.protein ?? 0,
        carbohydrate: data.macros?.carbohydrate ?? 0,
      });
    };

    // Update macros every 1000 milliseconds (1 second).
    const interval = setInterval(updateMacros, 1000);
    // Clean up the interval on component unmount.
    return () => clearInterval(interval);
  }, []);

  // Opens the macro editing modal.
  const openMacroModal = () => setShowMacroModal(true);

  // Closes the modal if the click event occurs on the modal background.
  const closeMacroModal = (e) => {
    if (e.target.classList.contains("macro-modal")) {
      setShowMacroModal(false);
    }
  };

  // Updates a specific macro field and synchronizes it with the shared data object.
  const handleMacroChange = (field, value) => {
    const newMacros = { ...macros, [field]: Number(value) };
    setMacros(newMacros);
    // Update the data object with the new value.
    data.macros[field] = Number(value);
  };

  return (
    <section className="macro-section">
      {/* When the user clicks the macro overview, open the editing modal */}
      <div className="macro-text" onClick={openMacroModal} style={{ cursor: "pointer" }}>
        {/* Display current macros using the MacrosOverview component */}
        <MacrosOverview macros={macros} />
      </div>

      {/* Conditionally render the macro editing modal */}
      {showMacroModal && (
        <div className="macro-modal" onClick={closeMacroModal}>
          <div className="macro-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Today’s Macro</h3>
            <div>
              <label>Fat (g):</label>
              <input
                type="number"
                value={macros.fat}
                onChange={(e) => handleMacroChange("fat", e.target.value)}
              />
            </div>
            <div>
              <label>Protein (g):</label>
              <input
                type="number"
                value={macros.protein}
                onChange={(e) => handleMacroChange("protein", e.target.value)}
              />
            </div>
            <div>
              <label>Carbohydrate (g):</label>
              <input
                type="number"
                value={macros.carbohydrate}
                onChange={(e) => handleMacroChange("carbohydrate", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default UserInfo;