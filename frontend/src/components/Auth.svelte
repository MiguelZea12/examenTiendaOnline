<script>
  import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
  import { auth } from '../firebase';
  import { api } from '../lib/api';
  import { navigate } from 'svelte-routing';

  let isLogin = true;
  let email = '';
  let password = '';
  let nombre = '';
  let rol = 'cliente';
  let error = '';
  let loading = false;

  async function handleSubmit() {
    error = '';
    loading = true;

    try {
      if (isLogin) {
        // Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        localStorage.setItem('token', token);
        
        // Obtener información del usuario
        const userData = await api.getMe();
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Redirigir según rol
        if (userData.rol === 'vendedor') {
          navigate('/vendedor');
        } else {
          navigate('/cliente');
        }
      } else {
        // Register
        // Primero registrar en backend
        await api.register({ email, password, nombre, rol });
        
        // Luego hacer login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        localStorage.setItem('token', token);
        
        // Obtener información del usuario
        const userData = await api.getMe();
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Redirigir según rol
        if (rol === 'vendedor') {
          navigate('/vendedor');
        } else {
          navigate('/cliente');
        }
      }
    } catch (err) {
      error = err.message || 'Error en autenticación';
    } finally {
      loading = false;
    }
  }

  function toggleMode() {
    isLogin = !isLogin;
    error = '';
  }
</script>

<div class="auth-container">
  <div class="auth-card">
    <h1>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h1>
    
    <form on:submit|preventDefault={handleSubmit}>
      {#if !isLogin}
        <div class="form-group">
          <label for="nombre">Nombre completo</label>
          <input
            type="text"
            id="nombre"
            bind:value={nombre}
            required
            placeholder="Tu nombre"
          />
        </div>

        <div class="form-group">
          <label for="rol">Tipo de cuenta</label>
          <select id="rol" bind:value={rol} required>
            <option value="cliente">Cliente</option>
            <option value="vendedor">Vendedor</option>
          </select>
        </div>
      {/if}

      <div class="form-group">
        <label for="email">Correo electrónico</label>
        <input
          type="email"
          id="email"
          bind:value={email}
          required
          placeholder="tu@email.com"
        />
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          required
          placeholder="••••••••"
          minlength="6"
        />
      </div>

      {#if error}
        <div class="error">{error}</div>
      {/if}

      <button type="submit" disabled={loading}>
        {loading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
      </button>
    </form>

    <p class="toggle">
      {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
      <button type="button" on:click={toggleMode}>
        {isLogin ? 'Regístrate' : 'Inicia Sesión'}
      </button>
    </p>
  </div>
</div>

<style>
  .auth-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 20px;
  }

  .auth-card {
    background: white;
    padding: 48px;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
    width: 100%;
    max-width: 420px;
    border: 1px solid rgba(0, 0, 0, 0.04);
  }

  h1 {
    margin: 0 0 32px;
    color: #1a202c;
    text-align: center;
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -0.5px;
  }

  .form-group {
    margin-bottom: 24px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    color: #4a5568;
    font-weight: 500;
    font-size: 14px;
    letter-spacing: 0.2px;
  }

  input, select {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 15px;
    box-sizing: border-box;
    transition: all 0.2s ease;
    background: #fafbfc;
  }

  input:focus, select:focus {
    outline: none;
    border-color: #4299e1;
    background: white;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }

  button[type="submit"] {
    width: 100%;
    padding: 14px;
    background: #4299e1;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 0.3px;
  }

  button[type="submit"]:hover:not(:disabled) {
    background: #3182ce;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(66, 153, 225, 0.3);
  }

  button[type="submit"]:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .error {
    background: #fff5f5;
    color: #c53030;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
    border-left: 3px solid #fc8181;
  }

  .toggle {
    text-align: center;
    margin-top: 24px;
    color: #718096;
    font-size: 14px;
  }

  .toggle button {
    background: none;
    border: none;
    color: #4299e1;
    cursor: pointer;
    font-weight: 600;
    transition: color 0.2s;
    margin-left: 4px;
  }

  .toggle button:hover {
    color: #3182ce;
  }
</style>
