import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";

// Components
import Navbar from "./components/common/Navbar";
import PrivateRoute from "./components/common/PrivateRoute";

// Context
import { AuthProvider } from "./context/AuthContext";
import { PostProvider } from "./context/PostContext";

function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <Router>
          <div className="app">
            <Navbar />
            <div
              className="container"
              style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}
            >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile/:id" element={<ProfilePage />} />
                <Route
                  path="/profile/edit"
                  element={
                    <PrivateRoute>
                      <EditProfilePage />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<div>Not found</div>} />
              </Routes>
            </div>
          </div>
        </Router>
      </PostProvider>
    </AuthProvider>
  );
}

export default App;
