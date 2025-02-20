import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import Categories from './components/Others';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import MyProfile from './pages/MyProfile';
import GoalsPage from "./pages/GoalsPage";
import SettingsPage from "./pages/SettingsPage";
import ProgressPage from "./pages/ProgressPage"; // Import Progress Page
import StepCountPage from './pages/StepCountPage';
import CalSpentPage from './pages/CalSpentPage';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // User state to store the current logged-in user (null if not logged in)
  const [user, setUser] = useState(null);
  // Loading state to ensure that we wait until the user check is complete
  const [loading, setLoading] = useState(true);

  // Check if the user exists in localStorage on app load, and verify the user with the backend
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // Send a request to verify that the user exists in the database
      fetch("http://127.0.0.1:8080/checkUserExists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: JSON.parse(storedUser).email }),
      })
      .then(response => {
        if (!response.ok) {
          console.warn("User does not exist in database. Logging out...");
          localStorage.clear();
          setUser(null);
        } else {
          return response.json(); // Get user details from the response
        }
      })
      .then(data => {
        if (data) setUser(data.user);
      })
      .catch(error => {
        console.error(" Network error while checking user:", error);
        localStorage.clear();
        setUser(null);
      })
      .finally(() => {
        setLoading(false); // Finish checking user, now render the UI
      });
    } else {
      setLoading(false);
    }
  }, []);

  // Prevent redirect loop: if the user is not logged in and is not on an auth page, redirect to Sign In
  useEffect(() => {
    if (!loading) {
      const authPages = ["/signIn", "/signUp"];
      if (!user && !authPages.includes(location.pathname)) {
        navigate('/signIn');
      }
    }
  }, [user, navigate, location.pathname, loading]);

  // Render a loading screen while checking user status
  if (loading) {
    return <div style={{ textAlign: "center", paddingTop: "50px" }}>Loading...</div>; 
  }

  return (
    <>
      <div className="app-container">
        {/* Show the navigation bar only if the user is logged in */}
        {user && <AppNavbar />}

        <div className="content-container">
          <Routes>
            {/* Sign In & Sign Up Pages (public routes) */}
            <Route path="/signIn" element={<SignIn onLogin={setUser} />} />
            <Route path="/signUp" element={<SignUp />} />

            {/* Protected Route: Settings (My Profile settings, requires user to be logged in) */}
            <Route
              path="/settings"
              element={user ? (
                <SettingsPage 
                  user={user} 
                  onLogout={() => {
                    localStorage.clear();
                    setUser(null);
                    navigate('/signIn'); // Redirect to Sign In after logout
                  }}
                />
              ) : (
                <Navigate to="/signIn" />
              )}
            />

            {/* Protected Routes for Home, Step Count, and Calories Spent */}
            <Route path="/" element={user ? <Home /> : <Navigate to="/signIn" />} />
            <Route path="/step-count" element={user ? <StepCountPage /> : <Navigate to="/signIn" />} />
            <Route path="/cal-spent" element={user ? <CalSpentPage /> : <Navigate to="/signIn" />} />

            {/* Protected Routes for Others & Communities */}
            <Route path="/others" element={user ? <Categories /> : <Navigate to="/signIn" />} />
            <Route path="/communities" element={user ? <Categories /> : <Navigate to="/signIn" />} />

            {/* Other Pages */}
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/myprofile" element={<MyProfile />} />
            <Route path="/progress" element={<ProgressPage />} />
          </Routes>
        </div>
        {/* Show Bottom Navigation if user is logged in */}
        {user && (
          <div className="bottom-nav-wrapper">
            <BottomNav />
          </div>
        )}
      </div>
    </>
  );
};

export default App;