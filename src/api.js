// src/api.js
const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API_URL = "https://spa-transferts-backend.onrender.com";
export default API_URL;


// --- Refuges ---
export async function fetchRefuges() {
  const r = await fetch(`${API_URL}/api/refuges`);
  return r.json();
}
export async function addRefuge(data) {
  const r = await fetch(`${API_URL}/api/refuges`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return r.json();
}

// --- Chiens (classiques) ---
export async function fetchChiens() {
  const r = await fetch(`${API_URL}/api/chiens`);
  return r.json();
}
export async function addChien(data) {
  const r = await fetch(`${API_URL}/api/chiens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return r.json();
}
export async function updateChien(id, data) {
  const r = await fetch(`${API_URL}/api/chiens/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return r.json();
}
export async function deleteChien(id) {
  const r = await fetch(`${API_URL}/api/chiens/${id}`, { method: "DELETE" });
  return r.json();
}

// --- Transferts ---
export async function fetchTransferts() {
  const r = await fetch(`${API_URL}/api/transferts`);
  return r.json();
}
export async function addTransfert(data) {
  const r = await fetch(`${API_URL}/api/transferts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return r.json();
}
export async function updateTransfert(id, data) {
  const r = await fetch(`${API_URL}/api/transferts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return r.json();
}
// --- SUPPRIMER UN TRANSFERT ---
export async function deleteTransfert(id) {
  const r = await fetch(`${API_URL}/api/transferts/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error(`deleteTransfert failed: ${r.status}`);
  return r.json();
}


// --- ANIMAUX (chiens + chiens12 + chats12) ---
export async function fetchAnimaux() {
  const r = await fetch(`${API_URL}/api/animaux`);
  if (!r.ok) throw new Error(`fetchAnimaux failed: ${r.status}`);
  return r.json();
}


// --- Chiens 12 mois ---
export async function fetchChiens12() {
  const r = await fetch(`${API_URL}/api/chiens12`);
  return r.json();
}
export async function addChien12(data) {
  const r = await fetch(`${API_URL}/api/chiens12`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return r.json();
}
export async function updateChien12(id, data) {
  const r = await fetch(`${API_URL}/api/chiens12/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return r.json();
}
export async function deleteChien12(id) {
  const r = await fetch(`${API_URL}/api/chiens12/${id}`, { method: "DELETE" });
  return r.json();
}

// --- Chats 12 mois ---
export async function fetchChats12() {
  const r = await fetch(`${API_URL}/api/chats12`);
  return r.json();
}
export async function addChat12(data) {
  const r = await fetch(`${API_URL}/api/chats12`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return r.json();
}
export async function updateChat12(id, data) {
  const r = await fetch(`${API_URL}/api/chats12/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return r.json();
}
export async function deleteChat12(id) {
  const r = await fetch(`${API_URL}/api/chats12/${id}`, { method: "DELETE" });
  return r.json();
}
