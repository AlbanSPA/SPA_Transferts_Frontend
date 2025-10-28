import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const TableauBord = () => {
  const [refuges, setRefuges] = useState([]);
  const [chiens, setChiens] = useState([]);
  const [transferts, setTransferts] = useState([]);

  // 🟢 Chargement des données depuis le backend
  useEffect(() => {
    Promise.all([
      fetch("http://192.168.1.157:5000/api/refuges").then((r) => r.json()),
      fetch("http://192.168.1.157:5000/api/chiens").then((r) => r.json()),
      fetch("http://192.168.1.157:5000/api/transferts").then((r) => r.json()),
    ])
      .then(([refData, chienData, transfData]) => {
        setRefuges(refData);
        setChiens(chienData);
        setTransferts(transfData);
        console.log("🐾 Transferts reçus :", transfData);
      })
      .catch((err) => console.error("❌ Erreur chargement statistiques :", err));
  }, []);

  // 📊 Données simples
  const nbRefuges = refuges.length;
  const nbChiens = chiens.length;
  const nbTransferts = transferts.length;

  // 📦 Statuts (inclut “Adopté”)
  const statsStatut = [
    { name: "En attente", value: transferts.filter((t) => t.statut === "En attente").length },
    { name: "En cours", value: transferts.filter((t) => t.statut === "En cours").length },
    { name: "Terminé", value: transferts.filter((t) => t.statut === "Terminé").length },
    { name: "Adopté", value: transferts.filter((t) => t.statut === "Adopté").length },
  ];

  // 📅 Transferts par mois
  const transfertsParMois = transferts.reduce((acc, t) => {
    if (t.date_transfert) {
      const mois = new Date(t.date_transfert).toLocaleString("fr-FR", { month: "long" });
      acc[mois] = (acc[mois] || 0) + 1;
    }
    return acc;
  }, {});
  const dataMois = Object.entries(transfertsParMois).map(([mois, total]) => ({ mois, total }));

  console.log("📊 statsStatut calculé :", statsStatut);
  console.log("📅 dataMois calculé :", dataMois);

  const COLORS = ["#9ca3af", "#3b82f6", "#22c55e", "#f59e0b"];

  // 🧾 Génération du PDF
  const genererPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString("fr-FR");

    doc.setFontSize(18);
    doc.text("🐾 Bilan mensuel - SPA Transferts", 14, 20);
    doc.setFontSize(11);
    doc.text(`Date : ${date}`, 14, 30);

    doc.setFontSize(13);
    doc.text("Statistiques générales :", 14, 45);

    autoTable(doc, {
      startY: 50,
      head: [["Indicateur", "Valeur"]],
      body: [
        ["Nombre de refuges", nbRefuges],
        ["Nombre de chiens", nbChiens],
        ["Nombre total de transferts", nbTransferts],
      ],
    });

    const finalY1 = doc.lastAutoTable.finalY + 15;
    doc.text("Répartition des transferts par statut :", 14, finalY1);

    autoTable(doc, {
      startY: finalY1 + 5,
      head: [["Statut", "Nombre"]],
      body: statsStatut.map((s) => [s.name, s.value]),
    });

    const finalY2 = doc.lastAutoTable.finalY + 15;
    doc.text("Transferts par mois :", 14, finalY2);

    autoTable(doc, {
      startY: finalY2 + 5,
      head: [["Mois", "Transferts"]],
      body: dataMois.map((d) => [d.mois, d.total]),
    });

    doc.save(`Bilan_SPA_${date}.pdf`);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10 text-orange-700">
        Tableau de bord SPA 📊
      </h1>

      {/* Bouton export */}
      <div className="flex justify-center mb-8">
        <button
          onClick={genererPDF}
          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition"
        >
          📥 Télécharger le bilan du mois
        </button>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 text-center">
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-gray-600">Refuges</h2>
          <p className="text-4xl font-bold text-amber-600">{nbRefuges}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-gray-600">Chiens</h2>
          <p className="text-4xl font-bold text-amber-600">{nbChiens}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-gray-600">Transferts</h2>
          <p className="text-4xl font-bold text-amber-600">{nbTransferts}</p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Répartition des transferts par statut
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statsStatut}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {statsStatut.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Nombre de transferts par mois
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataMois}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#f59e0b" name="Transferts" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TableauBord;
