import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "../styles/MyProfile.css";

const MyProfile = ({ user }) => {
  const navigate = useNavigate();

  // Initialize the profile state by first checking localStorage.
  // If a stored profile exists, parse and use it; otherwise, use the passed-in user prop.
  const [profile, setProfile] = useState(() => {
    const storedProfile = localStorage.getItem("user");
    return storedProfile ? JSON.parse(storedProfile) : user;
  });

  // State for the selected file when the user chooses a new profile picture.
  const [selectedFile, setSelectedFile] = useState(null);

  // Set the preview URL for the profile picture.
  // If the profile has an image, use it (prepended with the server URL),
  // otherwise use a placeholder image.
  const [preview, setPreview] = useState(
    profile.profilePicture 
      ? `http://localhost:8080${profile.profilePicture}` 
      : 'https://via.placeholder.com/150'
  );

  // State to track if the profile is in edit mode.
  const [isEditing, setIsEditing] = useState(false);

  // useEffect to fetch the latest profile data from the server whenever the profile's id changes.
  // It also updates the localStorage and the preview if a new profile picture is available.
  useEffect(() => {
    fetch(`http://localhost:8080/api/getProfile?userId=${profile.id}`)
      .then(response => response.json())
      .then(data => {
        setProfile(data);
        localStorage.setItem("user", JSON.stringify(data));

        if (data.profilePicture) {
          setPreview(`http://localhost:8080${data.profilePicture}`);
        }
      })
      .catch(error => console.error("Error fetching profile:", error));
  }, [profile.id]);

  // Handle changes in form inputs by updating the corresponding profile property.
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle file input change.
  // Sets the selected file and creates a preview URL using FileReader.
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission to update the profile.
  // Creates a FormData object including the name, userId, and optionally the profile picture file.
  // Sends the data to the server and updates the local profile state and localStorage on success.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("userId", profile.id);

    if (selectedFile) {
      formData.append("profilePicture", selectedFile);
    }

    try {
      const response = await fetch("http://localhost:8080/api/profile", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      alert(result.message);

      if (result.user) {
        setProfile(result.user);
        localStorage.setItem("user", JSON.stringify(result.user));
        setPreview(`http://localhost:8080${result.user.profilePicture}`);
      }

      // Exit edit mode after a successful update.
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Check console.");
    }
  };

  return (
    <Container className="profile-container">
      <Card className="profile-card">
        <h3 className="text-primary fw-bold text-center">My Profile</h3>

        {/* Conditionally render based on whether the profile is being edited */}
        {!isEditing ? (
          // View Profile Mode
          <div className="text-center">
            <img src={preview} alt="Profile" className="profile-img" />
            <h4 className="fw-bold">{profile.name}</h4>

            {/* Button to switch to edit mode */}
            <Button variant="primary" className="profile-btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>

            {/* Back button to navigate to the Others page */}
            <Button variant="outline-secondary" className="profile-btn mt-2" onClick={() => navigate('/others')}>
              ← Back to Others
            </Button>
          </div>
        ) : (
          // Edit Profile Mode: show a form to edit name and change profile picture
          <Form onSubmit={handleSubmit}>
            <Form.Group className="profile-form-group text-center">
              <img src={preview} alt="Profile" className="profile-img" />
            </Form.Group>

            <Form.Group className="profile-form-group">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                name="name" 
                value={profile.name} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>

            <Form.Group className="profile-form-group">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control 
                type="file" 
                onChange={handleFileChange} 
                accept="image/*" 
              />
            </Form.Group>

            {/* Save and Cancel Buttons */}
            <Button type="submit" variant="success" className="profile-btn">
              Save Changes
            </Button>
            <Button variant="secondary" className="profile-btn" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </Form>
        )}
      </Card>
    </Container>
  );
};

export default MyProfile;