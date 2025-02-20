import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import data, { updateDates } from "../data";
import "../styles/Home.css";
import UserInfo from "../components/UserInfo";
import "../utils/chartConfig";

function Home() {
  // useNavigate hook allows for programmatic navigation between routes.
  const navigate = useNavigate();

  // last7Days state stores an array of date objects for the last 7 days.
  // It is initialized with a copy of data.last7Days.
  const [last7Days, setLast7Days] = useState([...data.last7Days]);

  useEffect(() => {
    // Immediately update the dates using the updateDates function.
    updateDates();

    // Make a copy of the updated dates from the data object.
    const updatedDates = [...data.last7Days];
    // If the updated dates differ from the current state, update the state.
    if (JSON.stringify(updatedDates) !== JSON.stringify(last7Days)) {
      setLast7Days(updatedDates);
    }

    // Set up an interval to update dates every hour (3600000 ms).
    const interval = setInterval(() => {
      updateDates();
      const newDates = [...data.last7Days];
      // Compare new dates with the current state and update if necessary.
      if (JSON.stringify(newDates) !== JSON.stringify(last7Days)) {
        setLast7Days(newDates);
      }
    }, 3600000);

    // Clear the interval when the component unmounts to prevent memory leaks.
    return () => clearInterval(interval);
  }, [last7Days]); // Dependency on last7Days to check for changes.

  // Configuration for the Step Count Bar Chart:
  const stepData = {
    // Use the displayDate property of each day in last7Days for labels.
    labels: last7Days.map(day => day.displayDate),
    datasets: [
      {
        data: data.stepCount, // Data for step count from the data object.
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Semi-transparent teal color.
      },
    ],
  };

  // Chart options for the Step Count chart.
  const stepOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Hide the legend.
    },
    scales: {
      y: { display: false }, // Hide the Y-axis.
      x: { grid: { display: false } }, // Hide the gridlines on the X-axis.
    },
  };

  // Configuration for the Calories Spent Bar Chart:
  const calSpentData = {
    labels: last7Days.map(day => day.displayDate), // Labels for the X-axis.
    datasets: [
      {
        data: data.calSpent, // Calories spent data.
        backgroundColor: "rgba(255, 99, 132, 0.6)", // Semi-transparent red color.
      },
    ],
  };

  // Chart options for the Calories Spent chart.
  const calSpentOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Hide the legend.
    },
    scales: {
      y: { display: false }, // Hide the Y-axis.
      x: { grid: { display: false } }, // Hide the gridlines on the X-axis.
    },
  };

  return (
    <div className="content">
      {/* Display the user information section */}
      <UserInfo />

      {/* 📌 Step Count Section */}
      {/* Clicking this section navigates to the "/step-count" route */}
      <section className="chart-section clickable" onClick={() => navigate("/step-count")}>
        <h3>
          Step Count <br /> (Last 7 Days)
        </h3>
        <div className="chart-container">
          {/* Render the Step Count Bar Chart */}
          <Bar data={stepData} options={stepOptions} />
        </div>
      </section>

      {/* 📌 Calories Spent Section */}
      {/* Clicking this section navigates to the "/cal-spent" route */}
      <section className="chart-section clickable" onClick={() => navigate("/cal-spent")}>
        <h3>Cal Spent (kcal)</h3>
        <div className="chart-container">
          {/* Render the Calories Spent Bar Chart */}
          <Bar data={calSpentData} options={calSpentOptions} />
        </div>
      </section>
    </div>
  );
}

export default Home;