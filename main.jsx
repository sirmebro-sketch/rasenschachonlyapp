import React from "react";
import { createRoot } from "react-dom/client";
import Rasenschach from "./App.jsx";
import "./charakter-ui.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Rasenschach />
  </React.StrictMode>
);
