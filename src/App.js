import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Transferts from "./pages/Transferts";
import Chiens from "./pages/Chiens";
import Refuges from './pages/Refuges';
import TableauBord from "./pages/TableauBord";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        {/* Barre de navigation */}
        <nav className="bg-amber-600 text-white p-4 shadow-md flex justify-between items-center">
          <h1 className="text-2xl font-bold">SPA Transferts</h1>
          <div className="space-x-6">
            <Link to="/" className="hover:underline">Accueil</Link>
            <Link to="/transferts" className="hover:underline">Transferts</Link>
            <Link to="/chiens" className="hover:underline">Chiens</Link>
            <Link to="/refuges" className="hover:underline">Refuges</Link>
          </div>
        </nav>

        {/* Contenu des pages */}
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/transferts" element={<Transferts />} />
            <Route path="/chiens" element={<Chiens />} />
            <Route path="/refuges" element={<Refuges />} />
            <Route path="/dashboard" element={<TableauBord />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
