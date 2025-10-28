import React, { useState, useEffect } from "react";
import { fetchTransferts, addTransfert, fetchChiens, fetchRefuges } from "../api";

const Transferts = () => {
  const [transferts, setTransferts] = useState([]);
  const [chiens, setChiens] = useState([]);
  const [refuges, setRefuges] = useState([]);
  const [formData, setFormData] = useState({
    chien_id: "",
    refuge_depart_id: "",
    refuge_arrivee_id: "",
    statut: "En attente",
  });

  // Charger les données au démarrage
  useEffect(() => {
    Promise.all([fetchTransferts(), fetchChiens(), fetchRefuges()])
      .then(([transf, dogs, refs]) => {
        setTransferts(transf);
        setChiens(dogs);
        setRefuges(refs);
      })
      .catch((err) => console.error("Erreur chargement transferts :", err));
  }, []);

  // Ajouter un transfert
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTransfert(formData);
      setFormData({
        chien_id: "",
        refuge_depart_id: "",
        refuge_arrivee_id: "",
        statut: "En attente",
      });
      const data = await fetchTransferts();
      setTransferts(data);
    } catch (err) {
      console.error("Erreur ajout transfert :", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-orange-700">Transferts 🚚</h1>

      {/* Formulaire d’ajout */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-white p-4 rounded-lg shadow mb-8"
      >
        <select
          name="chien_id"
          value={formData.chien_id}
          onChange={(e) => setFormData({ ...formData, chien_id: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Choisir un chien</option>
          {chiens.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nom}
            </option>
          ))}
        </select>

        <select
          name="refuge_depart_id"
          value={formData.refuge_depart_id}
          onChange={(e) =>
            setFormData({ ...formData, refuge_depart_id: e.target.value })
          }
          className="border p-2 rounded"
        >
          <option value="">Refuge de départ</option>
          {refuges.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nom}
            </option>
          ))}
        </select>

        <select
          name="refuge_arrivee_id"
          value={formData.refuge_arrivee_id}
          onChange={(e) =>
            setFormData({ ...formData, refuge_arrivee_id: e.target.value })
          }
          className="border p-2 rounded"
        >
          <option value="">Refuge d’arrivée</option>
          {refuges.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nom}
            </option>
          ))}
        </select>

        <select
          name="statut"
          value={formData.statut}
          onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
          className="border p-2 rounded"
        >
          <option>En attente</option>
          <option>En cours</option>
          <option>Terminé</option>
          <option>Adopté</option>
        </select>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow"
        >
          Ajouter
        </button>
      </form>

      {/* Liste des transferts */}
      <div className="grid gap-4">
        {transferts.length === 0 ? (
          <p className="text-gray-500 text-center">Aucun transfert enregistré.</p>
        ) : (
          transferts.map((t) => (
            <div
              key={t.id}
              className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row sm:justify-between sm:items-center"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  🐶 Chien ID : {t.chien_id}
                </p>
                <p className="text-sm text-gray-600">
                  Départ : {t.refuge_depart_id} → Arrivée : {t.refuge_arrivee_id}
                </p>
                <p className="text-sm text-gray-600">📅 Statut : {t.statut}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Transferts;
