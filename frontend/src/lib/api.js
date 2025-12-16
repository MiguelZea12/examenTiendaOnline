const API_URL = import.meta.env.VITE_API_URL;

export async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error en la petición' }));
    throw new Error(error.error || 'Error en la petición');
  }

  return response.json();
}

export const api = {
  // Auth
  register: (data) => fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getMe: () => fetchAPI('/auth/me'),

  // Artículos
  getArticulos: () => fetchAPI('/articulos'),
  
  getMisArticulos: () => fetchAPI('/articulos/mis-articulos'),
  
  createArticulo: (data) => fetchAPI('/articulos', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  updateArticulo: (id, data) => fetchAPI(`/articulos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  deleteArticulo: (id) => fetchAPI(`/articulos/${id}`, {
    method: 'DELETE',
  }),

  // Pedidos
  createPedido: (data) => fetchAPI('/pedidos', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getPedidosVendedor: () => fetchAPI('/pedidos/vendedor'),
  
  getPedidosCliente: () => fetchAPI('/pedidos/cliente'),
  
  updateEstadoPedido: (id, estado) => fetchAPI(`/pedidos/${id}/estado`, {
    method: 'PATCH',
    body: JSON.stringify({ estado }),
  }),
};
