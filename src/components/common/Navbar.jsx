import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaUserPlus,
  FaSignInAlt,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navbarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "white",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  };

  return (
    <nav style={navbarStyle}>
      <div>
        <Link
          to="/"
          style={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            textDecoration: "none",
            color: "#1877f2",
          }}
        >
          SocialApp
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        {currentUser ? (
          <>
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "15px",
                textDecoration: "none",
                color: "#333",
              }}
            >
              <FaHome style={{ marginRight: "5px" }} />
              <span>Home</span>
            </Link>

            <Link
              to={`/profile/${currentUser.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "15px",
                textDecoration: "none",
                color: "#333",
              }}
            >
              <FaUser style={{ marginRight: "5px" }} />
              <span>Profile</span>
            </Link>

            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#333",
                marginRight: "15px",
              }}
            >
              <FaSignOutAlt style={{ marginRight: "5px" }} />
              <span>Logout</span>
            </button>

            <img
              src={
                currentUser.profilePicture || "https://via.placeholder.com/150"
              }
              alt={currentUser.username}
              style={{ width: "32px", height: "32px", borderRadius: "50%" }}
            />
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "15px",
                textDecoration: "none",
                color: "#333",
              }}
            >
              <FaSignInAlt style={{ marginRight: "5px" }} />
              <span>Login</span>
            </Link>

            <Link
              to="/register"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "#333",
              }}
            >
              <FaUserPlus style={{ marginRight: "5px" }} />
              <span>Register</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
