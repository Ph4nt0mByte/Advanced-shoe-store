const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const defaultHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const handleResp = async (resp) => {
  const data = await resp.json();
  if (!resp.ok) {
    const message = data?.message || 'API error';
    throw new Error(message);
  }
  return data;
};

export const listProducts = async () => {
  const resp = await fetch(`${BASE_URL}/products`);
  return handleResp(resp);
};

export const addProduct = async (payload) => {
  const resp = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResp(resp);
};

export const getProduct = async (id) => {
  const resp = await fetch(`${BASE_URL}/products/${id}`);
  return handleResp(resp);
};

export const updateProduct = async (id, payload) => {
  const resp = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: defaultHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResp(resp);
};

export const deleteProduct = async (id) => {
  const resp = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: defaultHeaders(),
  });
  return handleResp(resp);
};
