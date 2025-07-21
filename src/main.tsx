// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "@/contexts/AuthContext";
import "./i18n";
import i18n from "./i18n";

// Set saved language or default to English
const storedLang = localStorage.getItem("preferredLanguage") || "en";
i18n.changeLanguage(storedLang);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
