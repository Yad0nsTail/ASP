import React from 'react';
// Import necessary components from react-bootstrap for building the navigation bar
import { Navbar, Container, Button, FormControl, InputGroup } from 'react-bootstrap';
// Import the custom CSS styles for the navbar
import "../styles/Navbar.css";

const AppNavbar = () => {
  return (
    <>
      {/* Title Section with Add Button */}
      <div className="navbar-title-container">
        <Container className="navbar-title-content">
          {/* Display the application title "MyFitDiet" */}
          <Navbar.Brand className="navbar-title">MyFitDiet</Navbar.Brand>

          {/* Add Button: This button may be used to add new items (e.g., meals, workouts) */}
          <Button variant="success" className="header-add-button">
            {/* Icon for the button using Bootstrap Icons */}
            <i className="bi bi-plus"></i>
          </Button>
        </Container>
      </div>

      {/* Blue Navbar for the Search Bar */}
      <Navbar bg="primary" variant="dark" expand="lg" className="search-navbar">
        <Container className="search-container">
          {/* Input group for the search bar */}
          <InputGroup className="search-bar">
            {/* Icon inside the search bar */}
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            {/* Text input for search functionality */}
            <FormControl type="search" placeholder="Search" aria-label="Search" />
          </InputGroup>
        </Container>
      </Navbar>
    </>
  );
};

export default AppNavbar;