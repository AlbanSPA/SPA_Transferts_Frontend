import React, { useEffect, useMemo, useState } from "react";
import {
  fetchRefuges,
  fetchTransferts,
  addTransfert,
  updateTransfert,
  deleteTransfert,
  fetchAnimaux, // liste unifiée { id, nom, type: 'chien' | 'chien12' | 'chat12' }
} from "../api";

export default function Transferts() {
  const [refuges, setRefuges] = useState([]);
  const [animaux, setAnimaux] = useState([]);
  const [transferts, setTransferts] = useState([]);

  // Formulaire de création
  const [form, setForm] = useState({
    animalKey: "", // ex: "chien:5" | "chien12:3" | "chat12:7"
    refuge_depart_id: "",
    refuge_arrivee_id: "",
    statut: "En attente",
  });

  // Édition inline
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    refuge_depart_id: "",
    refuge_arrivee_id: "",
    statut: "En attente",
  });

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    try {
      const [refs, trans, anims] = await Promise.all([
        fetchRefuges(),
        fetchTransferts(),
        fetchAnimaux(),
      ]);
      setRefuges(refs || []);
      setTransferts(trans || []);
      setAnimaux(anims || []);
    } catch (e) {
      console.error("Erreur chargement /transferts :", e);
    }
  }

  // ---------- Helpers ----------
  function labelAnimal(a) {
    const prefix =
      a.type === "chien" ? "Chien" : a.type === "chien12" ? "Chien 12 mois" : "Chat 12 mois";
    return `${a.nom} (${prefix})`;
  }

  function keyFromAnimal(a) {
    return `${a.type}:${a.id}`;
  }

  function formatDate(iso) {
    if (!iso) return "—";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("fr-FR");
    } catch {
      return iso;
    }
  }

  // Maps id -> nom par type d’animal, construites depuis /api/animaux
  const animauxMaps = useMemo(() => {
    const chien = new Map();
    const chien12 = new Map();
    const chat12 = new Map();
    for (const a of animaux) {
      if (a.type === "chien") chien.set(a.id, a.nom);
      else if (a.type === "chien12") chien12.set(a.id, a.nom);
      else if (a.type === "chat12") chat12.set(a.id, a.nom);
    }
    return { chien, chien12, chat12 };
  }, [animaux]);

  function libelleAnimalPourTransfert(t) {
    // Compat : certains transferts anciens peuvent n’avoir que chien_id
    const type = t.animal_type || (t.chien_id ? "chien" : null);
    const id = t.animal_id ?? t.chien_id ?? null;

    if (!type || !id) return `ID ${t.id}`;

    const prefix =
      type === "chien" ? "Chien" : type === "chien12" ? "Chien 12 mois" : "Chat 12 mois";

    let nom;
    if (type === "chien") nom = animauxMaps.chien.get(id);
    else if (type === "chien12") nom = animauxMaps.chien12.get(id);
    else if (type === "chat12") nom = animauxMaps.chat12.get(id);

    return `${prefix} ${nom || `ID ${id}`}`;
  }

  // ---------- Création ----------
  async function handleCreate(e) {
    e.preventDefault();
    if (!form.animalKey || !form.refuge_depart_id || !form.refuge_arrivee_id) return;

    const [type, idStr] = form.animalKey.split(":");
    const payload = {
      animal_type: type,
      animal_id: Number(idStr),
      refuge_depart_id: Number(form.refuge_depart_id),
      refuge_arrivee_id: Number(form.refuge_arrivee_id),
      statut: form.statut,
    };
    try {
      await addTransfert(payload);
      setForm({
        animalKey: "",
        refuge_depart_id: "",
        refuge_arrivee_id: "",
        statut: "En attente",
      });
      await refresh();
    } catch (e) {
      console.error("Erreur création transfert :", e);
    }
  }

  // ---------- Édition ----------
  function startEdit(t) {
    setEditingId(t.id);
    setEditForm({
      refuge_depart_id: t.refuge_depart_id ?? "",
      refuge_arrivee_id: t.refuge_arrivee_id ?? "",
      statut: t.statut || "En attente",
    });
  }

  async function saveEdit(id) {
    const payload = {
      refuge_depart_id: editForm.refuge_depart_id ? Number(editForm.refuge_depart_id) : null,
      refuge_arrivee_id: editForm.refuge_arrivee_id ? Number(editForm.refuge_arrivee_id) : null,
      statut: editForm.statut,
    };
    try {
      await updateTransfert(id, payload);
      setEditingId(null);
      await refresh();
    } catch (e) {
      console.error("Erreur maj transfert :", e);
    }
  }

  // ---------- Suppression ----------
  async function remove(id) {
    if (!window.confirm("Supprimer ce transfert ?")) return;
    try {
      await deleteTransfert(id);
      await refresh();
    } catch (e) {
      console.error("Erreur suppression transfert :", e);
    }
  }

  // ---------- Rendu ----------
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold text-orange-700">Transferts 🚚</h1>
        <button
          onClick={refresh}
          title="Rafraîchir"
          className="text-sky-600 hover:text-sky-800 text-xl"
        >
          🔄
        </button>
      </div>

      {/* Formulaire de création */}
      <form
        onSubmit={handleCreate}
        className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-white p-4 rounded-lg shadow mb-8"
      >
        <select
          className="border p-2 rounded"
          value={form.animalKey}
          onChange={(e) => setForm({ ...form, animalKey: e.target.value })}
        >
          <option value="">Choisir un animal...</option>
          {animaux.map((a) => (
            <option key={keyFromAnimal(a)} value={keyFromAnimal(a)}>
              {labelAnimal(a)}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={form.refuge_depart_id}
          onChange={(e) => setForm({ ...form, refuge_depart_id: e.target.value })}
        >
          <option value="">Refuge de départ</option>
          {refuges.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nom}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={form.refuge_arrivee_id}
          onChange={(e) => setForm({ ...form, refuge_arrivee_id: e.target.value })}
        >
          <option value="">Refuge d’arrivée</option>
          {refuges.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nom}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={form.statut}
          onChange={(e) => setForm({ ...form, statut: e.target.value })}
        >
          <option>En attente</option>
          <option>Confirmé</option>
          <option>Effectué</option>
          <option>Annulé</option>
        </select>

        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow">
          Créer
        </button>
      </form>

      {/* Liste des transferts */}
      <div className="grid gap-4">
        {transferts.length === 0 ? (
          <p className="text-gray-500 text-center">Aucun transfert pour le moment.</p>
        ) : (
          transferts.map((t) => {
            const rDepart = refuges.find((r) => r.id === t.refuge_depart_id);
            const rArrivee = refuges.find((r) => r.id === t.refuge_arrivee_id);
            const header = libelleAnimalPourTransfert(t);

            return (
              <div key={t.id} className="bg-white p-4 rounded-lg shadow">
                {editingId === t.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 mb-1">Refuge de départ</p>
                      <select
                        className="border p-2 rounded w-full"
                        value={editForm.refuge_depart_id ?? ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, refuge_depart_id: e.target.value })
                        }
                      >
                        <option value="">—</option>
                        {refuges.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.nom}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 mb-1">Refuge d’arrivée</p>
                      <select
                        className="border p-2 rounded w-full"
                        value={editForm.refuge_arrivee_id ?? ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, refuge_arrivee_id: e.target.value })
                        }
                      >
                        <option value="">—</option>
                        {refuges.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.nom}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Statut</p>
                      <select
                        className="border p-2 rounded w-full"
                        value={editForm.statut}
                        onChange={(e) => setEditForm({ ...editForm, statut: e.target.value })}
                      >
                        <option>En attente</option>
                        <option>Confirmé</option>
                        <option>Effectué</option>
                        <option>Annulé</option>
                      </select>
                    </div>

                    <div className="flex gap-2 md:justify-end">
                      <button
                        onClick={() => saveEdit(t.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
                        title="Enregistrer"
                      >
                        💾
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded"
                        title="Annuler"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">{header}</p>
                      <p className="text-sm text-gray-600">
                        Départ: {rDepart ? rDepart.nom : `ID ${t.refuge_depart_id}`} — Arrivée:{" "}
                        {rArrivee ? rArrivee.nom : `ID ${t.refuge_arrivee_id}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        Statut: <span className="font-medium">{t.statut || "—"}</span> — Date:{" "}
                        {formatDate(t.date_transfert)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(t)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => remove(t.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
