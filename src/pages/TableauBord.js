import React, { useEffect, useState } from "react";
import { fetchChiens, fetchRefuges, fetchTransferts } from "../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const TableauBord = () => {
  const [chiens, setChiens] = useState([]);
  const [refuges, setRefuges] = useState([]);
  const [transferts, setTransferts] = useState([]);
  const [stats, setStats] = useState([]);

  // Chargement des données depuis l’API Render
  useEffect(() => {
    const loadData = async () => {
      try {
        const [dogs, shelters, moves] = await Promise.all([
          fetchChiens(),
          fetchRefuges(),
          fetchTransferts(),
        ]);
        setChiens(dogs);
        setRefuges(shelters);
        setTransferts(moves);

        // Construction des statistiques
        const data = shelters.map((r) => {
          const transfertsEntrants = moves.filter(
            (t) => t.refuge_arrivee_id === r.id
          ).length;
          const transfertsSortants = moves.filter(
            (t) => t.refuge_depart_id === r.id
          ).length;
          const nbChiens = dogs.filter((c) => c.refuge_id === r.id).length;

          return {
            refuge: r.nom,
            Chiens: nbChiens,
            "Entrées": transfertsEntrants,
            "Sorties": transfertsSortants,
          };
        });
        setStats(data);
      } catch (err) {
        console.error("Erreur chargement tableau de bord :", err);
      }
    };

    loadData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-orange-700">
        Tableau de Bord 📊
      </h1>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Chiens</h2>
          <p className="text-3xl font-bold text-orange-700">{chiens.length}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Refuges</h2>
          <p className="text-3xl font-bold text-orange-700">{refuges.length}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Transferts</h2>
          <p className="text-3xl font-bold text-orange-700">{transferts.length}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Activité par Refuge
        </h2>
        {stats.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats} margin={{ top: 20, right: 30, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="refuge" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Chiens" fill="#f97316" />
              <Bar dataKey="Entrées" fill="#22c55e" />
              <Bar dataKey="Sorties" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center">
            Données en cours de chargement...
          </p>
        )}
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Derniers Transferts
        </h2>
        <ul className="divide-y divide-gray-200">
          {transferts.slice(-5).reverse().map((t) => (
            <li key={t.id} className="py-2 text-sm text-gray-700">
              🐕 Chien {t.chien_id} — {t.statut}  
              <span className="text-gray-500">
                {" "}
                ({t.refuge_depart_id} → {t.refuge_arrivee_id})
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TableauBord;
