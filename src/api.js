const API_URL = "https://spa-transferts-backend.onrender.com";

export async function fetchRefuges() {
  const response = await fetch(`${API_URL}/api/refuges`);
  return response.json();
}

export async function fetchChiens() {
  const response = await fetch(`${API_URL}/api/chiens`);
  return response.json();
}

export async function fetchTransferts() {
  const response = await fetch(`${API_URL}/api/transferts`);
  return response.json();
}

export async function ajouterRefuge(data) {
  const response = await fetch(`${API_URL}/api/refuges`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function ajouterChien(data) {
  const response = await fetch(`${API_URL}/api/chiens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function ajouterTransfert(data) {
  const response = await fetch(`${API_URL}/api/transferts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}
