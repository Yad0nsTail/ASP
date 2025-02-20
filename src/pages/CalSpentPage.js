import React from "react";
// Import the GraphPage component that renders a chart with editable data and macros.
import GraphPage from "../components/GraphPage";
// Import the data object that holds various pieces of data used across the app.
import data from "../data";

// The CalSpentPage component is a wrapper that configures GraphPage to display "Calories Spent" data.
function CalSpentPage() {
  return (
    <GraphPage
      // Set the title for the chart section.
      title="Calories Spent"
      // Specify the type of data being handled.
      dataType="calSpent"
      // Initialize the chart with calorie-spent data from the data object.
      initialData={data.calSpent}
      // Use the displayDate property from each day in last7Days as labels on the chart.
      labels={data.last7Days.map(day => day.displayDate)}
      // Provide an update function that assigns new data to data.calSpent.
      updateData={(newData) => { data.calSpent = newData; }}
      // Enable the display of macros information.
      showMacros={true}
      // Pass the current macros data from the data object.
      macrosData={data.macros}
      // Provide an update function that assigns new macros data to data.macros.
      updateMacros={(newMacros) => { data.macros = newMacros; }}
    />
  );
}

export default CalSpentPage;