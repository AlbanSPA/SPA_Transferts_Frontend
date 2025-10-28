import React, { useState, useEffect } from "react";

const Chiens = () => {
  const [chiens, setChiens] = useState([]);
  const [refuges, setRefuges] = useState([]);
  const [formData, setFormData] = useState({
    nom: "",
    age: "",
    race: "",
    refuge_id: "",
  });

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  // 🔄 Charger les chiens et refuges
  useEffect(() => {
    Promise.all([
      fetch("http://192.168.1.157:5000/api/chiens").then((r) => r.json()),
      fetch("http://192.168.1.157:5000/api/refuges").then((r) => r.json()),
    ])
      .then(([c, r]) => {
        setChiens(c);
        setRefuges(r);
      })
      .catch((err) => console.error("Erreur chargement chiens :", err));
  }, []);

  const refreshChiens = () =>
    fetch("http://192.168.1.157:5000/api/chiens")
      .then((r) => r.json())
      .then(setChiens);

  // 🟢 Ajout
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://192.168.1.157:5000/api/chiens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((r) => r.json())
      .then(() => {
        setFormData({ nom: "", age: "", race: "", refuge_id: "" });
        refreshChiens();
      })
      .catch((err) => console.error("Erreur ajout chien :", err));
  };

  // ✏️ Édition
  const handleEdit = (chien) => {
    setEditId(chien.id);
    setEditData({ ...chien });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (id) => {
    fetch(`http://192.168.1.157:5000/api/chiens/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    })
      .then((r) => r.json())
      .then(() => {
        setEditId(null);
        refreshChiens();
      })
      .catch((err) => console.error("Erreur modification chien :", err));
  };

  // ❌ Suppression
  const handleDelete = (id) => {
    if (window.confirm("Supprimer ce chien ?")) {
      fetch(`http://192.168.1.157:5000/api/chiens/${id}`, { method: "DELETE" })
        .then(() => refreshChiens())
        .catch((err) => console.error("Erreur suppression chien :", err));
    }
  };

  // 🔍 Utilitaire : récupérer nom du refuge
  const getRefugeNom = (id) =>
    refuges.find((r) => r.id === id)?.nom || "—";

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
          placeholder="Nom"
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
          name="race"
          value={formData.race}
          onChange={(e) => setFormData({ ...formData, race: e.target.value })}
          placeholder="Race"
          className="border p-2 rounded"
        />
        <select
          name="refuge_id"
          value={formData.refuge_id}
          onChange={(e) =>
            setFormData({ ...formData, refuge_id: e.target.value })
          }
          className="border p-2 rounded"
        >
          <option value="">Refuge d’accueil</option>
          {refuges.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nom}
            </option>
          ))}
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
        {chiens.length === 0 ? (
          <p className="text-gray-500 text-center">Aucun chien enregistré.</p>
        ) : (
          chiens.map((c) => (
            <div
              key={c.id}
              className="bg-white p-4 rounded-lg shadow flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center"
            >
              {editId === c.id ? (
                // ✏️ Mode édition
                <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-2">
                  <input
                    name="nom"
                    value={editData.nom}
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
                    name="race"
                    value={editData.race}
                    onChange={handleEditChange}
                    className="border p-2 rounded"
                  />
                  <select
                    name="refuge_id"
                    value={editData.refuge_id}
                    onChange={handleEditChange}
                    className="border p-2 rounded"
                  >
                    {refuges.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nom}
                      </option>
                    ))}
                  </select>
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
                // 🐾 Mode affichage normal
                <>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      🐾 {c.nom}
                    </p>
                    <p className="text-sm text-gray-600">Race : {c.race}</p>
                    <p className="text-sm text-gray-600">Âge : {c.age}</p>
                    <p className="text-sm text-gray-600">
                      Refuge :{" "}
                      <span className="font-medium">
                        {getRefugeNom(c.refuge_id)}
                      </span>
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
