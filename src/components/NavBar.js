import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="bg-orange-700 text-white p-3 shadow-lg flex flex-wrap justify-center gap-4">
      <Link to="/" className="hover:text-yellow-200 font-semibold">Accueil</Link>
      <Link to="/tableaubord" className="hover:text-yellow-200 font-semibold">Tableau de bord</Link>
      <Link to="/refuges" className="hover:text-yellow-200 font-semibold">Refuges</Link>
      <Link to="/chiens" className="hover:text-yellow-200 font-semibold">Chiens</Link>
      <Link to="/chiens12" className="hover:text-yellow-200 font-semibold">Chiens 12 mois</Link>
      <Link to="/chats12" className="hover:text-yellow-200 font-semibold">Chats 12 mois</Link>
      <Link to="/transferts" className="hover:text-yellow-200 font-semibold">Transferts</Link>
    </nav>
  );
};

export default NavBar;
