<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { api } from '../lib/api';
  import { auth } from '../firebase';
  import { signOut } from 'firebase/auth';

  let articulos = [];
  let pedidos = [];
  let showForm = false;
  let editingId = null;
  let loading = false;
  let activeTab = 'articulos';

  let formData = {
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen: ''
  };

  let user = null;

  onMount(async () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      user = JSON.parse(userData);
      if (user.rol !== 'vendedor') {
        navigate('/cliente');
        return;
      }
    } else {
      navigate('/');
      return;
    }
    
    await loadArticulos();
    await loadPedidos();
  });

  async function loadArticulos() {
    try {
      articulos = await api.getMisArticulos();
    } catch (error) {
      alert('Error al cargar artículos: ' + error.message);
    }
  }

  async function loadPedidos() {
    try {
      const pedidosData = await api.getPedidosVendedor();
      console.log('Pedidos recibidos:', pedidosData);
      // Ordenar por fecha en el cliente
      pedidos = pedidosData.sort((a, b) => new Date(b.fechaPedido) - new Date(a.fechaPedido));
      console.log('Pedidos ordenados:', pedidos);
    } catch (error) {
      console.error('Error cargando pedidos:', error);
      alert('Error al cargar pedidos: ' + error.message);
    }
  }

  function openForm(articulo = null) {
    if (articulo) {
      editingId = articulo.id;
      formData = { ...articulo };
    } else {
      editingId = null;
      formData = { nombre: '', descripcion: '', precio: '', stock: '', imagen: '' };
    }
    showForm = true;
  }

  function closeForm() {
    showForm = false;
    editingId = null;
    formData = { nombre: '', descripcion: '', precio: '', stock: '', imagen: '' };
  }

  async function handleSubmit() {
    loading = true;
    try {
      if (editingId) {
        await api.updateArticulo(editingId, formData);
      } else {
        await api.createArticulo(formData);
      }
      await loadArticulos();
      closeForm();
    } catch (error) {
      alert('Error al guardar artículo: ' + error.message);
    } finally {
      loading = false;
    }
  }

  async function deleteArticulo(id) {
    if (!confirm('¿Estás seguro de eliminar este artículo?')) return;
    
    try {
      await api.deleteArticulo(id);
      await loadArticulos();
    } catch (error) {
      alert('Error al eliminar artículo: ' + error.message);
    }
  }

  async function updateEstado(pedidoId, nuevoEstado) {
    try {
      await api.updateEstadoPedido(pedidoId, nuevoEstado);
      await loadPedidos();
    } catch (error) {
      alert('Error al actualizar estado: ' + error.message);
    }
  }

  async function handleLogout() {
    await signOut(auth);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  }
</script>

<div class="vendedor-panel">
  <header>
    <div class="header-content">
      <h1>Panel de Vendedor</h1>
      <div class="user-info">
        <svg class="icon-user" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>{user?.nombre || 'Vendedor'}</span>
        <button on:click={handleLogout} class="btn-logout">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Salir
        </button>
      </div>
    </div>
  </header>

  <div class="tabs">
    <button 
      class:active={activeTab === 'articulos'} 
      on:click={() => activeTab = 'articulos'}
    >
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      </svg>
      Mis Artículos
    </button>
    <button 
      class:active={activeTab === 'pedidos'} 
      on:click={() => activeTab = 'pedidos'}
    >
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      Pedidos Recibidos
    </button>
  </div>

  {#if activeTab === 'articulos'}
    <div class="section">
      <div class="section-header">
        <h2>Mis Artículos</h2>
        <button on:click={() => openForm()} class="btn-primary">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nuevo Artículo
        </button>
      </div>

      <div class="articulos-grid">
        {#each articulos as articulo}
          <div class="articulo-card">
            {#if articulo.imagen}
              <img src={articulo.imagen} alt={articulo.nombre} />
            {:else}
              <div class="no-image">Sin imagen</div>
            {/if}
            <div class="articulo-info">
              <h3>{articulo.nombre}</h3>
              <p class="descripcion">{articulo.descripcion}</p>
              <p class="precio">${articulo.precio}</p>
              <p class="stock">Stock: {articulo.stock}</p>
              <div class="actions">
                <button on:click={() => openForm(articulo)} class="btn-edit">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Editar
                </button>
                <button on:click={() => deleteArticulo(articulo.id)} class="btn-delete">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        {:else}
          <p class="empty">No tienes artículos. ¡Crea tu primer artículo!</p>
        {/each}
      </div>
    </div>
  {/if}

  {#if activeTab === 'pedidos'}
    <div class="section">
      <h2>Pedidos Recibidos</h2>
      <div class="pedidos-list">
        {#each pedidos as pedido}
          <div class="pedido-card">
            <div class="pedido-header">
              <h3>{pedido.articuloNombre}</h3>
              <span class="estado estado-{pedido.estado}">{pedido.estado}</span>
            </div>
            <div class="pedido-details">
              <p><strong>Cantidad:</strong> {pedido.cantidad}</p>
              <p><strong>Total:</strong> ${pedido.total}</p>
              <p><strong>Cliente:</strong> {pedido.clienteNombre}</p>
              <p><strong>Teléfono:</strong> {pedido.clienteTelefono}</p>
              <p><strong>Dirección:</strong> {pedido.clienteDireccion}</p>
              <p><strong>Fecha:</strong> {new Date(pedido.fechaPedido).toLocaleString()}</p>
            </div>
            <div class="pedido-actions">
              <select 
                value={pedido.estado} 
                on:change={(e) => updateEstado(pedido.id, e.target.value)}
              >
                <option value="pendiente">Pendiente</option>
                <option value="procesando">Procesando</option>
                <option value="enviado">Enviado</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
        {:else}
          <p class="empty">No has recibido pedidos aún.</p>
        {/each}
      </div>
    </div>
  {/if}
</div>

{#if showForm}
  <div class="modal" on:click={closeForm} on:keydown={(e) => e.key === 'Escape' && closeForm()} role="button" tabindex="0">
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div class="modal-content" on:click|stopPropagation on:keydown|stopPropagation={() => {}} role="dialog" aria-modal="true">
      <h2>{editingId ? 'Editar Artículo' : 'Nuevo Artículo'}</h2>
      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input type="text" id="nombre" bind:value={formData.nombre} required />
        </div>

        <div class="form-group">
          <label for="descripcion">Descripción</label>
          <textarea id="descripcion" bind:value={formData.descripcion} required></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="precio">Precio</label>
            <input type="number" id="precio" bind:value={formData.precio} step="0.01" required />
          </div>

          <div class="form-group">
            <label for="stock">Stock</label>
            <input type="number" id="stock" bind:value={formData.stock} required />
          </div>
        </div>

        <div class="form-group">
          <label for="imagen">URL Imagen (opcional)</label>
          <input type="url" id="imagen" bind:value={formData.imagen} />
        </div>

        <div class="form-actions">
          <button type="button" on:click={closeForm} class="btn-secondary">Cancelar</button>
          <button type="submit" disabled={loading} class="btn-primary">
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .vendedor-panel {
    min-height: 100vh;
    background: #f8f9fa;
  }

  header {
    background: white;
    border-bottom: 1px solid #e9ecef;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h1 {
    margin: 0;
    color: #1a202c;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: -0.5px;
  }

  .user-info {
    display: flex;
    gap: 16px;
    align-items: center;
    color: #4a5568;
    font-size: 14px;
    font-weight: 500;
  }

  .icon-user {
    width: 20px;
    height: 20px;
    color: #718096;
  }

  .icon {
    width: 18px;
    height: 18px;
  }

  .btn-logout {
    padding: 8px 16px;
    background: #f7fafc;
    color: #718096;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
  }

  .btn-logout:hover {
    background: #edf2f7;
    color: #4a5568;
    border-color: #cbd5e0;
  }

  .tabs {
    background: white;
    border-bottom: 1px solid #e9ecef;
  }

  .tabs {
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 40px;
    gap: 8px;
  }

  .tabs button {
    padding: 14px 20px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #718096;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
  }

  .tabs button:hover {
    color: #4a5568;
  }

  .tabs button.active {
    color: #4299e1;
    border-bottom-color: #4299e1;
  }

  .section {
    padding: 32px 40px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  h2 {
    margin: 0;
    color: #1a202c;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.3px;
  }

  .btn-primary {
    padding: 10px 20px;
    background: #4299e1;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
  }

  .btn-primary:hover {
    background: #3182ce;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(66, 153, 225, 0.3);
  }

  .btn-secondary {
    padding: 10px 20px;
    background: #718096;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.2s;
  }

  .btn-secondary:hover {
    background: #4a5568;
  }

  .articulos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }

  .articulo-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e9ecef;
    transition: all 0.2s;
  }

  .articulo-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  .articulo-card img, .no-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    background: linear-gradient(135deg, #f5f7fa 0%, #e2e8f0 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #a0aec0;
    font-size: 14px;
    font-weight: 500;
  }

  .articulo-info {
    padding: 20px;
  }

  .articulo-info h3 {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 600;
    color: #1a202c;
  }

  .descripcion {
    color: #718096;
    font-size: 14px;
    line-height: 1.5;
    margin: 0 0 16px;
  }

  .precio {
    font-size: 24px;
    font-weight: 700;
    color: #4299e1;
    margin: 12px 0;
    letter-spacing: -0.5px;
  }

  .stock {
    color: #718096;
    font-size: 13px;
    font-weight: 500;
  }

  .actions {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }

  .btn-edit, .btn-delete {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.2s;
  }

  .btn-edit {
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #fde68a;
  }

  .btn-edit:hover {
    background: #fde68a;
  }

  .btn-delete {
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  }

  .btn-delete:hover {
    background: #fecaca;
  }

    .pedidos-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .pedido-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    border: 1px solid #e9ecef;
    transition: all 0.2s;
  }

  .pedido-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  }

  .pedido-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f1f3f5;
  }

  .pedido-id {
    font-size: 12px;
    color: #718096;
    font-weight: 500;
    font-family: monospace;
  }

  .estado-badge {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.3px;
  }

  .estado-badge.pendiente {
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #fde68a;
  }

  .estado-badge.enviado {
    background: #dbeafe;
    color: #1e40af;
    border: 1px solid #bfdbfe;
  }

  .estado-badge.entregado {
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  }

  .pedido-details {
    margin: 16px 0;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  .pedido-details p {
    margin: 8px 0;
    font-size: 14px;
    color: #4a5568;
    line-height: 1.6;
  }

  .pedido-details p strong {
    color: #1a202c;
    font-weight: 600;
    margin-right: 4px;
  }

  .pedido-card h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1a202c;
  }

  .estado {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: capitalize;
  }

  .estado-pendiente {
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #fde68a;
  }

  .estado-procesando {
    background: #e0e7ff;
    color: #3730a3;
    border: 1px solid #c7d2fe;
  }

  .estado-enviado {
    background: #dbeafe;
    color: #1e40af;
    border: 1px solid #bfdbfe;
  }

  .estado-entregado {
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  }

  .estado-cancelado {
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  }

  .pedido-actions select {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    color: #1a202c;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
  }

  .pedido-actions select:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }

  .pedido-items {
    margin: 16px 0;
  }

  .pedido-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #f1f3f5;
    font-size: 14px;
  }

  .pedido-item:last-child {
    border-bottom: none;
  }

  .pedido-total {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 2px solid #4299e1;
    font-size: 20px;
    font-weight: 700;
    text-align: right;
    color: #4299e1;
    letter-spacing: -0.5px;
  }

  .pedido-actions {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }

  .btn-estado {
    flex: 1;
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.2s;
  }

  .btn-estado.pendiente {
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #fde68a;
  }

  .btn-estado.pendiente:hover {
    background: #fde68a;
  }

  .btn-estado.enviado {
    background: #dbeafe;
    color: #1e40af;
    border: 1px solid #bfdbfe;
  }

  .btn-estado.enviado:hover {
    background: #bfdbfe;
  }

  .btn-estado.entregado {
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  }

  .btn-estado.entregado:hover {
    background: #a7f3d0;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .modal-content {
    background: white;
    padding: 32px;
    border-radius: 16px;
    width: 90%;
    max-width: 520px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    animation: slideUp 0.3s ease-out;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    color: #1a202c;
    font-weight: 600;
    font-size: 14px;
  }

  .form-group input, .form-group textarea {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    color: #1a202c;
    background: white;
    transition: all 0.2s;
    font-family: inherit;
    box-sizing: border-box;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #4299e1;
    background: white;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }

  .form-group textarea {
    resize: vertical;
    min-height: 100px;
    line-height: 1.5;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .form-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid #e9ecef;
  }
</style>
