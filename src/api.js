// src/api.js
const API_URL = "https://spa-transferts-backend.onrender.com";

export async function fetchRefuges() {
  const response = await fetch(`${API_URL}/api/refuges`);
  return response.json();
}

export async function addRefuge(data) {
  const response = await fetch(`${API_URL}/api/refuges`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function fetchChiens() {
  const response = await fetch(`${API_URL}/api/chiens`);
  return response.json();
}

export async function addChien(data) {
  const response = await fetch(`${API_URL}/api/chiens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function fetchTransferts() {
  const response = await fetch(`${API_URL}/api/transferts`);
  return response.json();
}

export async function addTransfert(data) {
  const response = await fetch(`${API_URL}/api/transferts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}
export async function updateTransfert(id, data) {
  const response = await fetch(`${API_URL}/api/transferts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}
