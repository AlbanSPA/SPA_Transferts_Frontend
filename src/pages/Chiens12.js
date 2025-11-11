import React, { useEffect, useState } from "react";
import {
  fetchChiens12,
  addChien12,
  updateChien12,
  deleteChien12,
  fetchRefuges,
} from "../api";

function refugeName(id) {
  if (!id) return "—";
  const r = refuges.find(r => r.id === id);
  return r ? r.nom : `Refuge #${id}`;
}


export default function Chiens12() {
  const [chiens, setChiens] = useState([]);
  const [refuges, setRefuges] = useState([]);

  const [form, setForm] = useState({ nom: "", age: "", race: "", refuge_id: "" });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ nom: "", age: "", race: "", refuge_id: "" });

  useEffect(() => { refresh(); }, []);

  async function refresh() {
    try {
      const [list, refs] = await Promise.all([fetchChiens12(), fetchRefuges()]);
      setChiens(Array.isArray(list) ? list : []);
      setRefuges(Array.isArray(refs) ? refs : []);
    } catch (e) {
      console.error("Erreur chargement Chiens12:", e);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      nom: form.nom.trim(),
      age: form.age ? Number(form.age) : null,
      race: form.race.trim(),
      refuge_id: form.refuge_id ? Number(form.refuge_id) : null,
    };
    try {
      await addChien12(payload);
      setForm({ nom: "", age: "", race: "", refuge_id: "" });
      await refresh();
    } catch (e) {
      console.error("Erreur ajout Chien12:", e);
    }
  }

  function startEdit(c) {
    setEditId(c.id);
    setEditForm({
      nom: c.nom || "",
      age: c.age ?? "",
      race: c.race || "",
      refuge_id: c.refuge_id ?? "",
    });
  }

  async function saveEdit(id) {
    const payload = {
      nom: editForm.nom.trim(),
      age: editForm.age ? Number(editForm.age) : null,
      race: editForm.race.trim(),
      refuge_id: editForm.refuge_id ? Number(editForm.refuge_id) : null,
    };
    try {
      await updateChien12(id, payload);
      setEditId(null);
      await refresh();
    } catch (e) {
      console.error("Erreur maj Chien12:", e);
    }
  }

  async function remove(id) {
    if (!window.confirm("Supprimer ce chien 12 mois ?")) return;
    try {
      await deleteChien12(id);
      await refresh();
    } catch (e) {
      console.error("Erreur suppression Chien12:", e);
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-orange-700">Chiens 12 mois 🐶</h1>

      {/* Formulaire d’ajout */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-white p-4 rounded-lg shadow mb-8"
      >
        <input
          className="border p-2 rounded"
          placeholder="Nom"
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Âge"
          type="number"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Race"
          value={form.race}
          onChange={(e) => setForm({ ...form, race: e.target.value })}
        />
        <select
          className="border p-2 rounded"
          value={form.refuge_id}
          onChange={(e) => setForm({ ...form, refuge_id: e.target.value })}
        >
          <option value="">Refuge (optionnel)</option>
          {refuges.map((r) => (
            <option key={r.id} value={r.id}>{r.nom}</option>
          ))}
        </select>
        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow">
          Ajouter
        </button>
      </form>

      {/* Liste */}
      <div className="grid gap-4">
        {chiens.length === 0 ? (
          <p className="text-gray-500 text-center">Aucun chien 12 mois enregistré.</p>
        ) : (
          chiens.map((c) => (
            <div key={c.id} className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {editId === c.id ? (
                <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-2">
                  <input
                    className="border p-2 rounded"
                    value={editForm.nom}
                    onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })}
                  />
                  <input
                    className="border p-2 rounded"
                    type="number"
                    value={editForm.age}
                    onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                  />
                  <input
                    className="border p-2 rounded"
                    value={editForm.race}
                    onChange={(e) => setEditForm({ ...editForm, race: e.target.value })}
                  />
                  <select
                    className="border p-2 rounded"
                    value={editForm.refuge_id ?? ""}
                    onChange={(e) => setEditForm({ ...editForm, refuge_id: e.target.value })}
                  >
                    <option value="">Refuge (optionnel)</option>
                    {refuges.map((r) => (
                      <option key={r.id} value={r.id}>{r.nom}</option>
                    ))}
                  </select>

                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(c.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded">💾</button>
                    <button onClick={() => setEditId(null)} className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded">❌</button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{c.nom}</p>
                    <p className="text-sm text-gray-600">Âge : {c.age ?? "—"} — Race : {c.race ?? "—"}</p>
                    <p className="text-sm text-gray-600">Refuge : {refugeName(c.refuge_id)}</p>

                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(c)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded">✏️</button>
                    <button onClick={() => remove(c.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded">🗑️</button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
