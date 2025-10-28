// src/pages/Refuges.js
import React, { useState, useEffect } from "react";
import { fetchRefuges, addRefuge } from "../api";

const Refuges = () => {
  const [refuges, setRefuges] = useState([]);
  const [formData, setFormData] = useState({
    nom: "",
    responsable: "",
    telephone: "",
    adresse: "",
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  // 🔄 Charger les refuges au démarrage
  useEffect(() => {
    loadRefuges();
  }, []);

  const loadRefuges = async () => {
    try {
      const data = await fetchRefuges();
      setRefuges(data);
    } catch (err) {
      console.error("Erreur chargement refuges :", err);
    }
  };

  // 🟢 Ajouter un refuge
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addRefuge(formData);
      setFormData({ nom: "", responsable: "", telephone: "", adresse: "" });
      loadRefuges();
    } catch (err) {
      console.error("Erreur ajout refuge :", err);
    }
  };

  // ✏️ Commencer la modification
  const handleEdit = (refuge) => {
    setEditId(refuge.id);
    setEditData({ ...refuge });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (id) => {
    try {
      await fetch(`https://spa-transferts-backend.onrender.com/api/refuges/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      setEditId(null);
      loadRefuges();
    } catch (err) {
      console.error("Erreur modification refuge :", err);
    }
  };

  // ❌ Supprimer
  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce refuge ?")) {
      try {
        await fetch(`https://spa-transferts-backend.onrender.com/api/refuges/${id}`, {
          method: "DELETE",
        });
        loadRefuges();
      } catch (err) {
        console.error("Erreur suppression refuge :", err);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-orange-700">Refuges 🏠</h1>

      {/* Formulaire d’ajout */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-white p-4 rounded-lg shadow mb-8"
      >
        <input
          name="nom"
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          placeholder="Nom du refuge"
          className="border p-2 rounded"
        />
        <input
          name="responsable"
          value={formData.responsable}
          onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
          placeholder="Responsable"
          className="border p-2 rounded"
        />
        <input
          name="telephone"
          value={formData.telephone}
          onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
          placeholder="Téléphone"
          className="border p-2 rounded"
        />
        <input
          name="adresse"
          value={formData.adresse}
          onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
          placeholder="Adresse"
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow"
        >
          Ajouter
        </button>
      </form>

      {/* Liste des refuges */}
      <div className="grid gap-4">
        {refuges.length === 0 ? (
          <p className="text-gray-500 text-center">Aucun refuge enregistré.</p>
        ) : (
          refuges.map((r) => (
            <div
              key={r.id}
              className="bg-white p-4 rounded-lg shadow flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center"
            >
              {editId === r.id ? (
                // 🧩 Édition
                <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-2">
                  <input name="nom" value={editData.nom} onChange={handleEditChange} className="border p-2 rounded" />
                  <input name="responsable" value={editData.responsable} onChange={handleEditChange} className="border p-2 rounded" />
                  <input name="telephone" value={editData.telephone} onChange={handleEditChange} className="border p-2 rounded" />
                  <input name="adresse" value={editData.adresse} onChange={handleEditChange} className="border p-2 rounded" />
                  <div className="flex gap-2">
                    <button onClick={() => handleEditSubmit(r.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded">
                      💾
                    </button>
                    <button onClick={() => setEditId(null)} className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded">
                      ❌
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{r.nom}</p>
                    <p className="text-sm text-gray-600">Responsable : <span className="font-medium">{r.responsable}</span></p>
                    <p className="text-sm text-gray-600">📞 {r.telephone || "—"}</p>
                    <p className="text-sm text-gray-600">📍 {r.adresse || "—"}</p>
                  </div>

                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <button onClick={() => handleEdit(r)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded">✏️</button>
                    <button onClick={() => handleDelete(r.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded">🗑️</button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Refuges;
