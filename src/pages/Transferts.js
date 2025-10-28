import React, { useState, useEffect } from "react";

const Transferts = () => {
  const [chiens, setChiens] = useState([]);
  const [refuges, setRefuges] = useState([]);
  const [transferts, setTransferts] = useState([]);
  const [formData, setFormData] = useState({
    chien_id: "",
    refuge_depart_id: "",
    refuge_arrivee_id: "",
    statut: "En attente",
  });

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  // 🔄 Charger toutes les données
  useEffect(() => {
    Promise.all([
      fetch("http://192.168.1.157:5000/api/chiens").then((r) => r.json()),
      fetch("http://192.168.1.157:5000/api/refuges").then((r) => r.json()),
      fetch("http://192.168.1.157:5000/api/transferts").then((r) => r.json()),
    ])
      .then(([c, r, t]) => {
        setChiens(c);
        setRefuges(r);
        setTransferts(t);
      })
      .catch((err) => console.error("Erreur chargement transferts :", err));
  }, []);

  const refreshTransferts = () =>
    fetch("http://192.168.1.157:5000/api/transferts")
      .then((r) => r.json())
      .then(setTransferts);

  // 🟢 Ajouter un transfert
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://192.168.1.157:5000/api/transferts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((r) => r.json())
      .then(() => {
        setFormData({
          chien_id: "",
          refuge_depart_id: "",
          refuge_arrivee_id: "",
          statut: "En attente",
        });
        refreshTransferts();
      })
      .catch((err) => console.error("Erreur ajout transfert :", err));
  };

  // ✏️ Édition
  const handleEdit = (t) => {
    setEditId(t.id);
    setEditData({ ...t });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (id) => {
    fetch(`http://192.168.1.157:5000/api/transferts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    })
      .then((r) => r.json())
      .then(() => {
        setEditId(null);
        refreshTransferts();
      })
      .catch((err) => console.error("Erreur modification transfert :", err));
  };

  // ❌ Suppression
  const handleDelete = (id) => {
    if (window.confirm("Supprimer ce transfert ?")) {
      fetch(`http://192.168.1.157:5000/api/transferts/${id}`, {
        method: "DELETE",
      })
        .then(() => refreshTransferts())
        .catch((err) => console.error("Erreur suppression transfert :", err));
    }
  };

  // 🔍 Utilitaires
  const getChienNom = (id) =>
    chiens.find((c) => c.id === id)?.nom || "—";
  const getRefugeNom = (id) =>
    refuges.find((r) => r.id === id)?.nom || "—";

  // 🎨 Couleurs selon le statut
  const statutColor = (statut) => {
    switch (statut) {
      case "En attente":
        return "bg-gray-300 text-gray-800";
      case "En cours":
        return "bg-blue-400 text-white";
      case "Terminé":
        return "bg-green-500 text-white";
      case "Adopté":
        return "bg-amber-500 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-orange-700">
        Transferts 🚚
      </h1>

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

      {/* Liste */}
      <div className="grid gap-4">
        {transferts.length === 0 ? (
          <p className="text-gray-500 text-center">
            Aucun transfert enregistré.
          </p>
        ) : (
          transferts.map((t) => (
            <div
              key={t.id}
              className="bg-white p-4 rounded-lg shadow flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center"
            >
              {editId === t.id ? (
                // 🧩 Mode édition
                <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-2">
                  <select
                    name="chien_id"
                    value={editData.chien_id}
                    onChange={handleEditChange}
                    className="border p-2 rounded"
                  >
                    {chiens.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nom}
                      </option>
                    ))}
                  </select>
                  <select
                    name="refuge_depart_id"
                    value={editData.refuge_depart_id}
                    onChange={handleEditChange}
                    className="border p-2 rounded"
                  >
                    {refuges.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nom}
                      </option>
                    ))}
                  </select>
                  <select
                    name="refuge_arrivee_id"
                    value={editData.refuge_arrivee_id}
                    onChange={handleEditChange}
                    className="border p-2 rounded"
                  >
                    {refuges.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nom}
                      </option>
                    ))}
                  </select>
                  <select
                    name="statut"
                    value={editData.statut}
                    onChange={handleEditChange}
                    className="border p-2 rounded"
                  >
                    <option>En attente</option>
                    <option>En cours</option>
                    <option>Terminé</option>
                    <option>Adopté</option>
                  </select>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSubmit(t.id)}
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
                // 📋 Affichage normal
                <>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      🐶 {getChienNom(t.chien_id)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Départ : {getRefugeNom(t.refuge_depart_id)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Arrivée : {getRefugeNom(t.refuge_arrivee_id)}
                    </p>
                    <p
                      className={`text-sm font-semibold inline-block px-2 py-1 rounded ${statutColor(
                        t.statut
                      )}`}
                    >
                      {t.statut}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => handleEdit(t)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
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

export default Transferts;
