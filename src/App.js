// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Refuges from "./pages/Refuges";
import Chiens from "./pages/Chiens";
import Transferts from "./pages/Transferts";
import TableauBord from "./pages/TableauBord";
import Chiens12 from "./pages/Chiens12";   // <-- import par défaut
import Chats12 from "./pages/Chats12";     // <-- import par défaut
import NavBar from "./components/NavBar";
console.log("Chiens12 =", Chiens12);
console.log("Chats12 =", Chats12);


function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/refuges" element={<Refuges />} />
        <Route path="/chiens" element={<Chiens />} />
        <Route path="/chiens12" element={<Chiens12 />} />
        <Route path="/chats12" element={<Chats12 />} />
        <Route path="/transferts" element={<Transferts />} />
        <Route path="/dashboard" element={<TableauBord />} />
      </Routes>
    </Router>
  );
}

export default App;
