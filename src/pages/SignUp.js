import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignUp.css"; 

const SignUp = () => {
    // State for storing user inputs (name, email, password)
    const [user, setUser] = useState({ name: "", email: "", password: "" });
    // State for holding error messages
    const [error, setError] = useState("");
    // useNavigate hook for programmatic navigation
    const navigate = useNavigate(); // Initialize navigate

    // Handle changes in the input fields
    const handleChange = (e) => {
        // Update the corresponding field in the user state
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    // Handle form submission for signing up
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        setError(""); // Clear previous error messages

        try {
            // Send a POST request to the sign-up endpoint with the user's data
            const response = await fetch("http://127.0.0.1:8080/signUp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });

            // Parse the JSON response from the server
            const data = await response.json();
            if (response.ok) {
                // On successful sign-up, alert the user with the success message
                alert("Sign-Up Successful: " + data.message);
                // Navigate to the Sign In page after a successful sign-up
                navigate("/signIn");
            } else {
                // If sign-up fails, set the error message
                setError(data.message || "Sign-Up failed");
            }
        } catch (error) {
            // Catch any network errors and display an appropriate error message
            console.error("Network Error:", error);
            setError("Network error, please try again.");
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                {/* 🔹 Logo / Title */}
                <h1 className="app-title">MyFitDiet</h1>

                {/* 🔹 Sign Up Title */}
                <h2 className="signup-header">Create an Account</h2>
                <p className="signup-subtext">Join us and start your fitness journey!</p>

                {/* 🔹 Sign Up Form */}
                <form onSubmit={handleSubmit} className="signup-form">
                    {/* Input field for full name */}
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        onChange={handleChange}
                        required
                        className="signup-input"
                    />
                    {/* Input field for email address */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        onChange={handleChange}
                        required
                        className="signup-input"
                    />
                    {/* Input field for password */}
                    <input
                        type="password"
                        name="password"
                        placeholder="Create Password"
                        onChange={handleChange}
                        required
                        className="signup-input"
                    />
                    {/* Submit button to trigger sign-up */}
                    <button type="submit" className="signup-button">
                        Sign Up
                    </button>
                    {/* Display error message if any */}
                    {error && <p className="signup-error">{error}</p>}
                </form>

                {/* 🔹 Back to Sign In Button */}
                <button className="signup-back-button" onClick={() => navigate("/signIn")}>
                    ← Back to Sign In
                </button>
            </div>
        </div>
    );
};

export default SignUp;