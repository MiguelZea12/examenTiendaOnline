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
      pedidos = await api.getPedidosVendedor();
    } catch (error) {
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
    <h1>Panel de Vendedor</h1>
    <div class="user-info">
      <span>👤 {user?.nombre || 'Vendedor'}</span>
      <button on:click={handleLogout} class="btn-logout">Cerrar Sesión</button>
    </div>
  </header>

  <div class="tabs">
    <button 
      class:active={activeTab === 'articulos'} 
      on:click={() => activeTab = 'articulos'}
    >
      📦 Mis Artículos
    </button>
    <button 
      class:active={activeTab === 'pedidos'} 
      on:click={() => activeTab = 'pedidos'}
    >
      🛒 Pedidos Recibidos
    </button>
  </div>

  {#if activeTab === 'articulos'}
    <div class="section">
      <div class="section-header">
        <h2>Mis Artículos</h2>
        <button on:click={() => openForm()} class="btn-primary">+ Nuevo Artículo</button>
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
                <button on:click={() => openForm(articulo)} class="btn-edit">Editar</button>
                <button on:click={() => deleteArticulo(articulo.id)} class="btn-delete">Eliminar</button>
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
    background: #f5f5f5;
  }

  header {
    background: white;
    padding: 20px 40px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h1 {
    margin: 0;
    color: #333;
  }

  .user-info {
    display: flex;
    gap: 15px;
    align-items: center;
  }

  .btn-logout {
    padding: 8px 16px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .tabs {
    display: flex;
    background: white;
    padding: 0 40px;
    gap: 10px;
    border-bottom: 1px solid #ddd;
  }

  .tabs button {
    padding: 15px 25px;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    font-size: 16px;
    color: #666;
  }

  .tabs button.active {
    color: #667eea;
    border-bottom-color: #667eea;
  }

  .section {
    padding: 40px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  h2 {
    margin: 0 0 20px;
    color: #333;
  }

  .btn-primary {
    padding: 10px 20px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
  }

  .btn-secondary {
    padding: 10px 20px;
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .articulos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  .articulo-card {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .articulo-card img, .no-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    background: #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
  }

  .articulo-info {
    padding: 15px;
  }

  .articulo-info h3 {
    margin: 0 0 10px;
    font-size: 18px;
  }

  .descripcion {
    color: #666;
    font-size: 14px;
    margin: 0 0 10px;
  }

  .precio {
    font-size: 24px;
    font-weight: bold;
    color: #667eea;
    margin: 10px 0;
  }

  .stock {
    color: #666;
    font-size: 14px;
  }

  .actions {
    display: flex;
    gap: 10px;
    margin-top: 15px;
  }

  .btn-edit, .btn-delete {
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
  }

  .btn-edit {
    background: #ffc107;
    color: #333;
  }

  .btn-delete {
    background: #dc3545;
    color: white;
  }

  .pedidos-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .pedido-card {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .pedido-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }

  .pedido-header h3 {
    margin: 0;
  }

  .estado {
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .estado-pendiente { background: #ffc107; color: #333; }
  .estado-procesando { background: #17a2b8; color: white; }
  .estado-enviado { background: #007bff; color: white; }
  .estado-entregado { background: #28a745; color: white; }
  .estado-cancelado { background: #dc3545; color: white; }

  .pedido-details p {
    margin: 5px 0;
    color: #666;
  }

  .pedido-actions {
    margin-top: 15px;
  }

  .pedido-actions select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
  }

  .empty {
    text-align: center;
    color: #999;
    padding: 40px;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    padding: 30px;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
    color: #555;
    font-weight: 500;
  }

  .form-group input, .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
    box-sizing: border-box;
  }

  .form-group textarea {
    resize: vertical;
    min-height: 80px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }

  .form-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 20px;
  }
</style>
