const BASE_URL = '/api';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// ─── Auth ────────────────────────────────────────────────────────────────────

export const registerUser = async ({ username, email, password }) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ username, email, password }),
  });
  return handleResponse(res);
};

export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
};

// ─── Rooms ───────────────────────────────────────────────────────────────────

export const createRoom = async ({ name, language }, token) => {
  const res = await fetch(`${BASE_URL}/rooms/create`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ name, language }),
  });
  return handleResponse(res);
};

export const getRoom = async (roomId, token) => {
  const res = await fetch(`${BASE_URL}/rooms/${roomId}`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  return handleResponse(res);
};

export const listRooms = async (token) => {
  const res = await fetch(`${BASE_URL}/rooms`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  return handleResponse(res);
};

export const saveCode = async (roomId, code, token) => {
  const res = await fetch(`${BASE_URL}/rooms/${roomId}/save`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ code }),
  });
  return handleResponse(res);
};
