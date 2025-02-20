import React from "react";
import { Card, Container } from "react-bootstrap"; // Import Card and Container components for layout and styling
import { Link } from "react-router-dom"; // Import Link for navigation between routes
import "../styles/Others.css"; // Import custom CSS for styling the Others component

const Others = () => {
  // Define an array of category objects. Each object contains an id, name, path, icon, and color.
  const categories = [
    { id: 1, name: "My Profile", path: "/myprofile", icon: "person-circle", color: "#0d6efd" },
    { id: 2, name: "Barcode Scanner", path: "#", icon: "qr-code-scan", color: "#28a745" },
    { id: 3, name: "Goals", path: "/goals", icon: "check-circle", color: "#ffc107" },
    { id: 4, name: "Progress", path: "/progress", icon: "graph-up-arrow", color: "#17a2b8" },
    { id: 5, name: "Settings", path: "/settings", icon: "gear-fill", color: "#dc3545" },
  ];

  return (
    <>
      {/* Container for the categories title */}
      <div className="categories-title-container">
        <Container>
          {/* Title displayed above the categories */}
          <h3 className="categories-title">Categories</h3>
        </Container>
      </div>

      {/* Container for the category cards */}
      <Container className="others-container">
        {/* Map over the categories array to create a card for each category */}
        {categories.map((category) => (
          <Card key={category.id} className="others-card" data-hover-color={category.hoverColor}>
            <Card.Body className="others-card-body">
              {/* 
                The Link component navigates to the category's path.
                If the path is "#", it stays on the same page.
              */}
              <Link to={category.path !== "#" ? category.path : "#"} className="others-link">
                {/* Icon container with dynamic color */}
                <div className="others-icon" style={{ color: category.color }}>
                  {/* Dynamically add the appropriate Bootstrap Icon class based on the category.icon value */}
                  <i className={`bi bi-${category.icon}`}></i>
                </div>
                {/* Display the category name */}
                <Card.Title className="others-title">{category.name}</Card.Title>
              </Link>
            </Card.Body>
          </Card>
        ))}
      </Container>
    </>
  );
};

export default Others;