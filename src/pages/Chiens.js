import React, { useState, useEffect } from "react";
import { fetchChiens, addChien } from "../api";

const Chiens = () => {
  const [chiens, setChiens] = useState([]);
  const [formData, setFormData] = useState({
    nom: "",
    race: "",
    age: "",
    refuge_id: "",
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  // 🔄 Charger les chiens
  useEffect(() => {
    loadChiens();
  }, []);

  const loadChiens = async () => {
    try {
      const data = await fetchChiens();
      setChiens(data);
    } catch (err) {
      console.error("Erreur chargement chiens :", err);
    }
  };

  // 🟢 Ajouter un chien
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addChien(formData);
      setFormData({ nom: "", race: "", age: "", refuge_id: "" });
      loadChiens();
    } catch (err) {
      console.error("Erreur ajout chien :", err);
    }
  };

  // ✏️ Modification
  const handleEdit = (chien) => {
    setEditId(chien.id);
    setEditData({ ...chien });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (id) => {
    try {
      await fetch(`https://spa-transferts-backend.onrender.com/api/chiens/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      setEditId(null);
      loadChiens();
    } catch (err) {
      console.error("Erreur modification chien :", err);
    }
  };

  // ❌ Suppression
  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce chien ?")) {
      try {
        await fetch(`https://spa-transferts-backend.onrender.com/api/chiens/${id}`, {
          method: "DELETE",
        });
        loadChiens();
      } catch (err) {
        console.error("Erreur suppression chien :", err);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-orange-700">Chiens 🐶</h1>

      {/* Formulaire d’ajout */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-white p-4 rounded-lg shadow mb-8"
      >
        <input
          name="nom"
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          placeholder="Nom du chien"
          className="border p-2 rounded"
        />
        <input
          name="race"
          value={formData.race}
          onChange={(e) => setFormData({ ...formData, race: e.target.value })}
          placeholder="Race"
          className="border p-2 rounded"
        />
        <input
          name="age"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          placeholder="Âge"
          className="border p-2 rounded"
        />
        <input
          name="refuge_id"
          value={formData.refuge_id}
          onChange={(e) =>
            setFormData({ ...formData, refuge_id: e.target.value })
          }
          placeholder="ID du refuge"
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow"
        >
          Ajouter
        </button>
      </form>

      {/* Liste des chiens */}
      <div className="grid gap-4">
        {chiens.length === 0 ? (
          <p className="text-gray-500 text-center">Aucun chien enregistré.</p>
        ) : (
          chiens.map((c) => (
            <div
              key={c.id}
              className="bg-white p-4 rounded-lg shadow flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center"
            >
              {editId === c.id ? (
                <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-2">
                  <input
                    name="nom"
                    value={editData.nom}
                    onChange={handleEditChange}
                    className="border p-2 rounded"
                  />
                  <input
                    name="race"
                    value={editData.race}
                    onChange={handleEditChange}
                    className="border p-2 rounded"
                  />
                  <input
                    name="age"
                    value={editData.age}
                    onChange={handleEditChange}
                    className="border p-2 rounded"
                  />
                  <input
                    name="refuge_id"
                    value={editData.refuge_id}
                    onChange={handleEditChange}
                    className="border p-2 rounded"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSubmit(c.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
                    >
                      💾
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{c.nom}</p>
                    <p className="text-sm text-gray-600">
                      Race : {c.race || "—"}
                    </p>
                    <p className="text-sm text-gray-600">Âge : {c.age || "—"}</p>
                    <p className="text-sm text-gray-600">
                      Refuge ID : {c.refuge_id || "—"}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => handleEdit(c)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
                    >
                      🗑️
                    </button>
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

export default Chiens;
