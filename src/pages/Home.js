import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo_spa.png";

function Home() {       // ✅ Le nom de la fonction = Home
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-100 to-gray-200 text-center p-6">
      <img
        src={logo}
        alt="Logo SPA"
        className="w-32 h-32 mb-6 drop-shadow-lg"
      />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Bienvenue à la SPA
      </h1>
      <p className="text-gray-600 text-lg mb-8">
        Application de suivi des transferts inter-refuges 🐶🐱
      </p>

      {/* ✅ Lien vers le tableau de bord */}
      <Link
        to="/dashboard"
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-200"
      >
        Accéder au tableau de bord
      </Link>
    </div>
  );
}

export default Home;    
