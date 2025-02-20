import React from "react";

// The MacrosOverview component receives a 'macros' prop, which is expected to contain current values for fat, protein, and carbohydrates.
function MacrosOverview({ macros }) {
  // If the macros data hasn't been provided yet, show a loading message.
  if (!macros) {
    return <p>Loading macros...</p>;
  }

  // Define daily macro goals (you can adjust these values to fit your daily targets).
  const FAT_GOAL = 70;
  const PROTEIN_GOAL = 130;
  const CARB_GOAL = 300;

  // Calculate the width for the progress bars as a percentage.
  // This ensures the progress bar does not exceed 100% width.
  // For example, if macros.fat is 35 and FAT_GOAL is 70, then fatWidth will be 50%.
  const fatWidth = Math.min(100, (macros.fat / FAT_GOAL) * 100);
  const proteinWidth = Math.min(100, (macros.protein / PROTEIN_GOAL) * 100);
  const carbWidth = Math.min(100, (macros.carbohydrate / CARB_GOAL) * 100);

  // The component renders a section that shows the user's macro information with progress bars.
  return (
    <section className="macro-section">
      <div className="macro-content">
        {/* Profile icon, can be used for a user avatar or similar */}
        <div className="profile-icon">👤</div>

        <div className="macro-info">
          <h2>Today's Macros</h2>

          {/* Fat Macro */}
          <div className="macro-item">
            <span className="label">
              Fat: {macros.fat ?? 0} g / {FAT_GOAL} g
            </span>
            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: `${fatWidth}%`, // Dynamic width based on current fat intake
                  backgroundColor: "#D77A61", // Color for fat progress
                }}
              ></div>
            </div>
          </div>

          {/* Protein Macro */}
          <div className="macro-item">
            <span className="label">
              Protein: {macros.protein ?? 0} g / {PROTEIN_GOAL} g
            </span>
            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: `${proteinWidth}%`, // Dynamic width based on current protein intake
                  backgroundColor: "#6A994E", // Color for protein progress
                }}
              ></div>
            </div>
          </div>

          {/* Carbohydrate Macro */}
          <div className="macro-item">
            <span className="label">
              Carbohydrates: {macros.carbohydrate ?? 0} g / {CARB_GOAL} g
            </span>
            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: `${carbWidth}%`, // Dynamic width based on current carbohydrate intake
                  backgroundColor: "#F4A261", // Color for carbohydrate progress
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MacrosOverview;