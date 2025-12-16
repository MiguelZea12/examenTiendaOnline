<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { api } from '../lib/api';
  import { auth } from '../firebase';
  import { signOut } from 'firebase/auth';

  let articulos = [];
  let misPedidos = [];
  let activeTab = 'tienda';
  let selectedArticulo = null;
  let showPedidoForm = false;

  let formData = {
    cantidad: 1,
    nombre: '',
    direccion: '',
    telefono: ''
  };

  let user = null;

  onMount(async () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      user = JSON.parse(userData);
      if (user.rol !== 'cliente') {
        navigate('/vendedor');
        return;
      }
      // Pre-llenar nombre si existe
      formData.nombre = user.nombre || '';
    } else {
      navigate('/');
      return;
    }
    
    await loadArticulos();
    await loadMisPedidos();
  });

  async function loadArticulos() {
    try {
      articulos = await api.getArticulos();
    } catch (error) {
      alert('Error al cargar artículos: ' + error.message);
    }
  }

  async function loadMisPedidos() {
    try {
      const pedidos = await api.getPedidosCliente();
      // Ordenar por fecha en el cliente
      misPedidos = pedidos.sort((a, b) => new Date(b.fechaPedido) - new Date(a.fechaPedido));
    } catch (error) {
      alert('Error al cargar pedidos: ' + error.message);
    }
  }

  function openPedidoForm(articulo) {
    selectedArticulo = articulo;
    formData.cantidad = 1;
    showPedidoForm = true;
  }

  function closePedidoForm() {
    showPedidoForm = false;
    selectedArticulo = null;
    formData = { cantidad: 1, nombre: user?.nombre || '', direccion: '', telefono: '' };
  }

  async function handlePedido() {
    if (!formData.nombre || !formData.direccion || !formData.telefono) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (formData.cantidad > selectedArticulo.stock) {
      alert('Stock insuficiente');
      return;
    }

    try {
      await api.createPedido({
        articuloId: selectedArticulo.id,
        cantidad: parseInt(formData.cantidad),
        nombre: formData.nombre,
        direccion: formData.direccion,
        telefono: formData.telefono
      });

      alert('¡Pedido realizado con éxito!');
      closePedidoForm();
      await loadArticulos();
      await loadMisPedidos();
      activeTab = 'pedidos';
    } catch (error) {
      alert('Error al crear pedido: ' + error.message);
    }
  }

  async function handleLogout() {
    await signOut(auth);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  }
</script>

<div class="cliente-panel">
  <header>
    <h1>Tienda Online</h1>
    <div class="user-info">
      <span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        {user?.nombre || 'Cliente'}
      </span>
      <button on:click={handleLogout} class="btn-logout">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Salir
      </button>
    </div>
  </header>

  <div class="tabs">
    <button 
      class:active={activeTab === 'tienda'} 
      on:click={() => activeTab = 'tienda'}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      Tienda
    </button>
    <button 
      class:active={activeTab === 'pedidos'} 
      on:click={() => activeTab = 'pedidos'}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
      Mis Pedidos
    </button>
  </div>

  {#if activeTab === 'tienda'}
    <div class="section">
      <h2>Artículos Disponibles</h2>
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
              <p class="vendedor">Vendedor: {articulo.vendedorNombre}</p>
              <div class="footer">
                <p class="precio">${articulo.precio}</p>
                <p class="stock">Disponible: {articulo.stock}</p>
              </div>
              <button 
                on:click={() => openPedidoForm(articulo)} 
                class="btn-comprar"
                disabled={articulo.stock === 0}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {articulo.stock === 0 ? 'Agotado' : 'Comprar'}
              </button>
            </div>
          </div>
        {:else}
          <p class="empty">No hay artículos disponibles en este momento.</p>
        {/each}
      </div>
    </div>
  {/if}

  {#if activeTab === 'pedidos'}
    <div class="section">
      <h2>Mis Pedidos</h2>
      <div class="pedidos-list">
        {#each misPedidos as pedido}
          <div class="pedido-card">
            <div class="pedido-header">
              <div>
                <h3>{pedido.articuloNombre}</h3>
                <p class="fecha">{new Date(pedido.fechaPedido).toLocaleString()}</p>
              </div>
              <span class="estado estado-{pedido.estado}">{pedido.estado}</span>
            </div>
            <div class="pedido-body">
              <div class="pedido-info">
                <p><strong>Cantidad:</strong> {pedido.cantidad}</p>
                <p><strong>Precio unitario:</strong> ${pedido.articuloPrecio}</p>
                <p><strong>Total:</strong> ${pedido.total}</p>
              </div>
              <div class="pedido-envio">
                <p><strong>Enviar a:</strong></p>
                <p>{pedido.clienteNombre}</p>
                <p>{pedido.clienteDireccion}</p>
                <p>Tel: {pedido.clienteTelefono}</p>
              </div>
            </div>
          </div>
        {:else}
          <p class="empty">No has realizado pedidos aún.</p>
        {/each}
      </div>
    </div>
  {/if}
</div>

{#if showPedidoForm && selectedArticulo}
  <div class="modal" on:click={closePedidoForm} on:keydown={(e) => e.key === 'Escape' && closePedidoForm()} role="button" tabindex="0">
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div class="modal-content" on:click|stopPropagation on:keydown|stopPropagation={() => {}} role="dialog" aria-modal="true">
      <h2>Realizar Pedido</h2>
      
      <div class="articulo-summary">
        <h3>{selectedArticulo.nombre}</h3>
        <p class="precio">${selectedArticulo.precio}</p>
        <p class="stock-info">Stock disponible: {selectedArticulo.stock}</p>
      </div>

      <form on:submit|preventDefault={handlePedido}>
        <div class="form-group">
          <label for="cantidad">Cantidad</label>
          <input 
            type="number" 
            id="cantidad" 
            bind:value={formData.cantidad} 
            min="1" 
            max={selectedArticulo.stock}
            required 
          />
        </div>

        <div class="form-group">
          <label for="nombre">Nombre completo</label>
          <input 
            type="text" 
            id="nombre" 
            bind:value={formData.nombre} 
            required 
            placeholder="Tu nombre"
          />
        </div>

        <div class="form-group">
          <label for="direccion">Dirección de envío</label>
          <textarea 
            id="direccion" 
            bind:value={formData.direccion} 
            required
            placeholder="Calle, número, ciudad, código postal"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="telefono">Teléfono de contacto</label>
          <input 
            type="tel" 
            id="telefono" 
            bind:value={formData.telefono} 
            required 
            placeholder="+34 123 456 789"
          />
        </div>

        <div class="total">
          <strong>Total a pagar:</strong> 
          ${(selectedArticulo.precio * formData.cantidad).toFixed(2)}
        </div>

        <div class="form-actions">
          <button type="button" on:click={closePedidoForm} class="btn-secondary">
            Cancelar
          </button>
          <button type="submit" class="btn-primary">
            Confirmar Pedido
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .cliente-panel {
    min-height: 100vh;
    background: #f8f9fa;
  }

  header {
    background: white;
    border-bottom: 1px solid #e9ecef;
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h1 {
    margin: 0;
    color: #1a202c;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.3px;
  }

  .user-info {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .user-info span {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #4a5568;
    font-size: 14px;
    font-weight: 500;
  }

  .btn-logout {
    padding: 8px 16px;
    background: #f8f9fa;
    color: #718096;
    border: 1px solid #e9ecef;
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
    background: #e9ecef;
    color: #4a5568;
  }

  .tabs {
    display: flex;
    background: white;
    padding: 0 40px;
    gap: 10px;
    border-bottom: 1px solid #ddd;
  }

  .tabs button {
    padding: 16px 24px;
    border: none;
    background: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    color: #718096;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
  }

  .tabs button:hover {
    color: #4a5568;
    background: #f8f9fa;
  }

  .tabs button.active {
    border-bottom-color: #4299e1;
    color: #4299e1;
    font-weight: 600;
  }

  .section {
    padding: 40px;
    max-width: 1200px;
    margin: 0 auto;
  }

  h2 {
    margin: 0 0 30px;
    color: #333;
  }

  .articulos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
  }

  .articulo-card {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .articulo-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }

  .articulo-card img, .no-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 48px;
  }

  .articulo-info {
    padding: 20px;
  }

  .articulo-info h3 {
    margin: 0 0 10px;
    font-size: 18px;
    color: #333;
  }

  .descripcion {
    color: #666;
    font-size: 14px;
    margin: 0 0 10px;
    line-height: 1.5;
  }

  .vendedor {
    color: #999;
    font-size: 12px;
    margin: 0 0 15px;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .precio {
    font-size: 28px;
    font-weight: bold;
    color: #667eea;
    margin: 0;
  }

  .stock {
    color: #28a745;
    font-size: 14px;
    margin: 0;
  }

  .btn-comprar {
    width: 100%;
    padding: 12px 16px;
    background: #4299e1;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.2s;
  }

  .btn-comprar:hover:not(:disabled) {
    background: #3182ce;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(66, 153, 225, 0.3);
  }

  .btn-comprar:disabled {
    background: #e9ecef;
    color: #a0aec0;
    cursor: not-allowed;
  }

  .pedidos-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .pedido-card {
    background: white;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .pedido-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #f0f0f0;
  }

  .pedido-header h3 {
    margin: 0 0 5px;
    color: #333;
  }

  .fecha {
    margin: 0;
    color: #999;
    font-size: 12px;
  }

  .estado {
    padding: 6px 18px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .estado-pendiente { background: #fff3cd; color: #856404; }
  .estado-procesando { background: #d1ecf1; color: #0c5460; }
  .estado-enviado { background: #cce5ff; color: #004085; }
  .estado-entregado { background: #d4edda; color: #155724; }
  .estado-cancelado { background: #f8d7da; color: #721c24; }

  .pedido-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }

  .pedido-info p, .pedido-envio p {
    margin: 8px 0;
    color: #666;
  }

  .pedido-envio {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
  }

  .empty {
    text-align: center;
    color: #999;
    padding: 60px 20px;
    font-size: 16px;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    padding: 35px;
    border-radius: 15px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-content h2 {
    margin: 0 0 20px;
    color: #333;
  }

  .articulo-summary {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 25px;
    text-align: center;
  }

  .articulo-summary h3 {
    margin: 0 0 10px;
  }

  .articulo-summary .precio {
    font-size: 32px;
    margin-bottom: 5px;
  }

  .stock-info {
    color: #28a745;
    font-size: 14px;
    margin: 0;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    color: #555;
    font-weight: 600;
  }

  .form-group input, .form-group textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    box-sizing: border-box;
    font-family: inherit;
  }

  .form-group textarea {
    resize: vertical;
    min-height: 80px;
  }

  .form-group input:focus, .form-group textarea:focus {
    outline: none;
    border-color: #667eea;
  }

  .total {
    background: #667eea;
    color: white;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    font-size: 20px;
    margin: 20px 0;
  }

  .form-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  .btn-primary, .btn-secondary {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-primary {
    background: #667eea;
    color: white;
  }

  .btn-primary:hover {
    background: #5568d3;
  }

  .btn-secondary {
    background: #6c757d;
    color: white;
  }

  .btn-secondary:hover {
    background: #5a6268;
  }

  @media (max-width: 768px) {
    .pedido-body {
      grid-template-columns: 1fr;
    }
    
    header, .tabs, .section {
      padding-left: 20px;
      padding-right: 20px;
    }
  }
</style>
