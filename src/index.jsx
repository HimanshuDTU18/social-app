import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { PostProvider } from "./context/PostContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <PostProvider>
        <App />
      </PostProvider>
    </AuthProvider>
  </React.StrictMode>
);
