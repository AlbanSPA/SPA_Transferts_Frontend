// src/pages/Transferts.js
import React, { useEffect, useState } from "react";
import {
  fetchRefuges,
  fetchTransferts,
  addTransfert,
  updateTransfert,
} from "../api";
import { fetchAnimaux } from "../api";

export default function Transferts() {
  const [refuges, setRefuges] = useState([]);
  const [animaux, setAnimaux] = useState([]); // [{id, nom, type}]
  const [transferts, setTransferts] = useState([]);

  const [form, setForm] = useState({
    animal_type: "",
    animal_id: "",
    refuge_depart_id: "",
    refuge_arrivee_id: "",
    statut: "En attente",
  });

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    try {
      const [refs, anis, trs] = await Promise.all([
        fetchRefuges(),
        fetchAnimaux(),
        fetchTransferts(),
      ]);
      setRefuges(refs || []);
      setAnimaux(anis || []);
      setTransferts(trs || []);
    } catch (e) {
      console.error("Erreur chargement /transferts :", e);
    }
  }

  function labelAnimal(animal_type, animal_id) {
    // Tente de résoudre d'abord sur le nouveau schéma
    if (animal_type && animal_id != null) {
      const a = animaux.find((x) => x.type === animal_type && x.id === animal_id);
      if (a) return `${a.nom} (${typeFr(a.type)})`;
    }
    // Compat legacy: certains transferts anciens n’ont que chien_id
    // (le backend renvoie toujours chien_id pour compat)
    // On regarde si on trouve un animal type "chien" avec le même id.
    const aLegacy = animaux.find((x) => x.type === "chien" && x.id === animal_id);
    if (aLegacy) return `${aLegacy.nom} (chien)`;
    // fallback
    return animal_id ? `ID ${animal_id}` : "—";
  }

  function typeFr(t) {
    switch (t) {
      case "chien": return "Chien";
      case "chien12": return "Chien 12 mois";
      case "chat12": return "Chat 12 mois";
      default: return t || "—";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      animal_type: form.animal_type || null,
      animal_id: form.animal_id ? Number(form.animal_id) : null,
      refuge_depart_id: form.refuge_depart_id ? Number(form.refuge_depart_id) : null,
      refuge_arrivee_id: form.refuge_arrivee_id ? Number(form.refuge_arrivee_id) : null,
      statut: form.statut || "En attente",
    };
    try {
      await addTransfert(payload);
      setForm({
        animal_type: "",
        animal_id: "",
        refuge_depart_id: "",
        refuge_arrivee_id: "",
        statut: "En attente",
      });
      await refresh();
    } catch (e) {
      console.error("Erreur ajout transfert :", e);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Supprimer ce transfert ?")) return;
    try {
      await fetch(`${process.env.REACT_APP_API_URL || ""}/api/transferts/${id}`, {
        method: "DELETE",
      });
      await refresh();
    } catch (e) {
      console.error("Erreur suppression transfert :", e);
    }
  }

  // Liste d’options d’animaux avec value = "<type>|<id>"
  const animalOptions = animaux.map((a) => ({
    value: `${a.type}|${a.id}`,
    label: `${a.nom} — ${typeFr(a.type)}`,
  }));

  function onChangeAnimal(e) {
    const v = e.target.value; // "chien12|3"
    if (!v) {
      setForm({ ...form, animal_type: "", animal_id: "" });
      return;
    }
    const [type, idStr] = v.split("|");
    setForm({ ...form, animal_type: type, animal_id: idStr });
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-orange-700">Transferts 🔄</h1>

      {/* Formulaire de création */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-white p-4 rounded-lg shadow mb-8"
      >
        {/* Sélecteur animal unifié */}
        <select
          className="border p-2 rounded"
          value={form.animal_type && form.animal_id ? `${form.animal_type}|${form.animal_id}` : ""}
          onChange={onChangeAnimal}
          required
        >
          <option value="">Choisir un animal…</option>
          {animalOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Refuge départ */}
        <select
          className="border p-2 rounded"
          value={form.refuge_depart_id}
          onChange={(e) => setForm({ ...form, refuge_depart_id: e.target.value })}
          required
        >
          <option value="">Refuge de départ</option>
          {refuges.map((r) => (
            <option key={r.id} value={r.id}>{r.nom}</option>
          ))}
        </select>

        {/* Refuge arrivée */}
        <select
          className="border p-2 rounded"
          value={form.refuge_arrivee_id}
          onChange={(e) => setForm({ ...form, refuge_arrivee_id: e.target.value })}
          required
        >
          <option value="">Refuge d’arrivée</option>
          {refuges.map((r) => (
            <option key={r.id} value={r.id}>{r.nom}</option>
          ))}
        </select>

        {/* Statut */}
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
      <div className="grid gap-3">
        {transferts.length === 0 ? (
          <p className="text-gray-500 text-center">Aucun transfert pour le moment.</p>
        ) : (
          transferts.map((t) => (
            <div
              key={t.id}
              className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
            >
              <div className="space-y-1">
                <p className="text-lg font-semibold text-gray-800">
                  {labelAnimal(t.animal_type, t.animal_id)}
                </p>
                <p className="text-sm text-gray-600">
                  Départ: {refuges.find((r) => r.id === t.refuge_depart_id)?.nom || t.refuge_depart_id} — Arrivée: {refuges.find((r) => r.id === t.refuge_arrivee_id)?.nom || t.refuge_arrivee_id}
                </p>
                <p className="text-sm text-gray-600">
                  Statut: <span className="font-medium">{t.statut || "En attente"}</span>
                  {t.date_transfert ? ` — Date: ${t.date_transfert}` : ""}
                </p>
              </div>
              <div className="flex gap-2">
                {/* Bouton suppression simple (édition possible à ajouter plus tard) */}
                <button
                  onClick={() => handleDelete(t.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
