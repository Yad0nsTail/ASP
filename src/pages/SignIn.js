import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignIn.css"; 

const SignIn = ({ onLogin }) => {
    // Initialize state for user credentials (email and password)
    const [user, setUser] = useState({ email: "", password: "" });
    // Initialize state for error messages
    const [error, setError] = useState("");
    // useNavigate hook for programmatic navigation
    const navigate = useNavigate();

    // Update user state when input fields change
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    // Handle form submission for signing in
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setError(""); // Clear any previous errors

        try {
            // Send a POST request to the sign-in endpoint with the user's credentials
            const response = await fetch("http://localhost:8080/signIn", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });

            // Parse the JSON response from the server
            const data = await response.json();
            if (response.ok) {
                // Create an updated user object with the relevant properties
                const updatedUser = {
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    profilePicture: data.user.profilePicture
                        ? `http://localhost:8080${data.user.profilePicture}`
                        : null,
                };

                // Save the user data to localStorage for persistence
                localStorage.setItem("user", JSON.stringify(updatedUser));
                // Call the onLogin callback to update the parent component's state
                onLogin(updatedUser);
                // Navigate to the home page after successful login
                navigate("/");
            } else {
                // Set error message from server response or a default message
                setError(data.message || "Login failed");
            }
        } catch (error) {
            // Handle network errors
            setError("Network error, please try again.");
            console.error("Network Error:", error);
        }
    };

    return (
        <div className="signin-container">
            <div className="signin-card">
                {/* 🔹 Logo / Title */}
                <h1 className="app-title">MyFitDiet</h1>

                {/* 🔹 Sign In Header */}
                <h2 className="signin-header">Welcome Back!</h2>
                <p className="signin-subtext">Log in to continue your fitness journey</p>

                {/* 🔹 Sign In Form */}
                <form onSubmit={handleSubmit} className="signin-form">
                    {/* Email Input Field */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        onChange={handleChange}
                        required
                        className="signin-input"
                    />
                    {/* Password Input Field */}
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        onChange={handleChange}
                        required
                        className="signin-input"
                    />
                    {/* Submit Button */}
                    <button type="submit" className="signin-button">
                        Sign In
                    </button>
                    {/* Display error message if any */}
                    {error && <p className="signin-error">{error}</p>}
                </form>

                {/* 🔹 Link to Sign Up Page */}
                <p className="signin-link">
                    Don't have an account?{" "}
                    <a href="/signUp">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default SignIn;